import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Integration } from '../models/Integration';
import { User } from '../models/User';

export interface IntegrationStatus {
  provider: string;
  connected: boolean;
  email?: string;
  name?: string;
  lastSync?: Date;
  error?: string;
  permissions: string[];
}

export interface AuthUrlResponse {
  authUrl: string;
  state: string; // For security
}

export class IntegrationService {
  private googleOAuth2Client: OAuth2Client;

  constructor() {
    this.googleOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Get all integrations for a user
   */
  async getUserIntegrations(userId: string): Promise<IntegrationStatus[]> {
    const integrations = await Integration.findAll({
      where: { userId },
      order: [['provider', 'ASC']]
    });

    const allProviders = [
      'google_calendar',
      'google_gmail',
      'outlook_calendar',
      'outlook_email'
    ];

    return allProviders.map(provider => {
      const integration = integrations.find(i => i.provider === provider);
      
      return {
        provider,
        connected: integration?.status === 'connected' || false,
        email: integration?.providerEmail,
        name: integration?.providerName,
        lastSync: integration?.lastSyncAt,
        error: integration?.status === 'error' ? integration.errorMessage : undefined,
        permissions: integration?.permissions || []
      };
    });
  }

  /**
   * Get Google Calendar authorization URL
   */
  async getGoogleCalendarAuthUrl(userId: string): Promise<AuthUrlResponse> {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const state = Buffer.from(JSON.stringify({ userId, provider: 'google_calendar' })).toString('base64');

    const authUrl = this.googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state
    });

    return { authUrl, state };
  }

  /**
   * Get Google Gmail authorization URL
   */
  async getGoogleGmailAuthUrl(userId: string): Promise<AuthUrlResponse> {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const state = Buffer.from(JSON.stringify({ userId, provider: 'google_gmail' })).toString('base64');

    const authUrl = this.googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state
    });

    return { authUrl, state };
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, state: string): Promise<Integration> {
    try {
      // Decode state to get user info
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      const { userId, provider } = stateData;

      // Exchange code for tokens
      const { tokens } = await this.googleOAuth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new Error('No access token received');
      }

      // Set credentials to get user info
      this.googleOAuth2Client.setCredentials(tokens);
      
      // Get user profile
      const oauth2 = google.oauth2({ version: 'v2', auth: this.googleOAuth2Client });
      const { data: profile } = await oauth2.userinfo.get();

      // Determine permissions based on provider
      const permissions = provider === 'google_calendar' 
        ? ['calendar.read', 'calendar.write', 'calendar.events']
        : ['email.read', 'email.send', 'email.compose'];

      // Create or update integration
      const [integration] = await Integration.upsert({
        userId,
        provider,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        providerUserId: profile.id || undefined,
        providerEmail: profile.email || undefined,
        providerName: profile.name || undefined,
        status: 'connected',
        permissions,
        lastSyncAt: new Date()
      });

      return integration;
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw new Error('Failed to connect Google account');
    }
  }

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(userId: string, provider: string): Promise<void> {
    const integration = await Integration.findOne({
      where: { userId, provider }
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    // Revoke Google tokens if it's a Google integration
    if (provider.startsWith('google_')) {
      try {
        this.googleOAuth2Client.setCredentials({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken
        });
        await this.googleOAuth2Client.revokeCredentials();
      } catch (error) {
        console.error('Error revoking Google credentials:', error);
        // Continue with disconnection even if revocation fails
      }
    }

    integration.status = 'disconnected';
    integration.accessToken = '';
    integration.refreshToken = undefined;
    integration.expiresAt = undefined;
    integration.lastErrorAt = new Date();
    integration.errorMessage = 'Manually disconnected';

    await integration.save();
  }

  /**
   * Refresh expired tokens
   */
  async refreshIntegrationTokens(integrationId: string): Promise<Integration> {
    const integration = await Integration.findByPk(integrationId);
    
    if (!integration) {
      throw new Error('Integration not found');
    }

    if (!integration.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      if (integration.provider.startsWith('google_')) {
        this.googleOAuth2Client.setCredentials({
          refresh_token: integration.refreshToken
        });

        const { credentials } = await this.googleOAuth2Client.refreshAccessToken();
        
        integration.accessToken = credentials.access_token!;
        integration.expiresAt = credentials.expiry_date ? new Date(credentials.expiry_date) : undefined;
        integration.status = 'connected';
        integration.lastSyncAt = new Date();
        integration.errorMessage = undefined;
        integration.lastErrorAt = undefined;

        await integration.save();
      }

      return integration;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      
      integration.status = 'error';
      integration.errorMessage = 'Failed to refresh access token';
      integration.lastErrorAt = new Date();
      
      await integration.save();
      throw error;
    }
  }

  /**
   * Test integration connection
   */
  async testIntegration(userId: string, provider: string): Promise<boolean> {
    const integration = await Integration.findOne({
      where: { userId, provider }
    });

    if (!integration || integration.status !== 'connected') {
      return false;
    }

    try {
      if (provider === 'google_calendar') {
        this.googleOAuth2Client.setCredentials({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken
        });

        const calendar = google.calendar({ version: 'v3', auth: this.googleOAuth2Client });
        await calendar.calendarList.list({ maxResults: 1 });
        
        return true;
      } else if (provider === 'google_gmail') {
        this.googleOAuth2Client.setCredentials({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken
        });

        const gmail = google.gmail({ version: 'v1', auth: this.googleOAuth2Client });
        await gmail.users.getProfile({ userId: 'me' });
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Integration test failed:', error);
      
      // Update integration status
      integration.status = 'error';
      integration.errorMessage = 'Connection test failed';
      integration.lastErrorAt = new Date();
      await integration.save();
      
      return false;
    }
  }

  /**
   * Get integration by provider
   */
  async getIntegration(userId: string, provider: string): Promise<Integration | null> {
    return Integration.findOne({
      where: { userId, provider }
    });
  }

  /**
   * Update integration settings
   */
  async updateIntegrationSettings(userId: string, provider: string, settings: any): Promise<Integration> {
    const integration = await Integration.findOne({
      where: { userId, provider }
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    integration.settings = { ...integration.settings, ...settings };
    await integration.save();

    return integration;
  }

  /**
   * Get quick setup status for onboarding
   */
  async getQuickSetupStatus(userId: string): Promise<{
    calendar: boolean;
    email: boolean;
    completionPercentage: number;
    nextSteps: string[];
  }> {
    const integrations = await Integration.findAll({
      where: { userId, status: 'connected' }
    });

    const hasCalendar = integrations.some(i => i.provider.includes('calendar'));
    const hasEmail = integrations.some(i => i.provider.includes('gmail') || i.provider.includes('email'));

    const completionPercentage = ((hasCalendar ? 50 : 0) + (hasEmail ? 50 : 0));
    
    const nextSteps = [];
    if (!hasCalendar) nextSteps.push('Connect your calendar for automatic interview scheduling');
    if (!hasEmail) nextSteps.push('Connect your email for response monitoring and automation');

    return {
      calendar: hasCalendar,
      email: hasEmail,
      completionPercentage,
      nextSteps
    };
  }

  /**
   * Bulk health check for all user integrations
   */
  async healthCheckUserIntegrations(userId: string): Promise<void> {
    const integrations = await Integration.findAll({
      where: { userId, status: 'connected' }
    });

    for (const integration of integrations) {
      try {
        const isHealthy = await this.testIntegration(userId, integration.provider);
        if (!isHealthy && integration.status === 'connected') {
          // Try to refresh tokens first
          if (integration.refreshToken) {
            await this.refreshIntegrationTokens(integration.id);
          }
        }
      } catch (error) {
        console.error(`Health check failed for ${integration.provider}:`, error);
      }
    }
  }
}

export const integrationService = new IntegrationService();