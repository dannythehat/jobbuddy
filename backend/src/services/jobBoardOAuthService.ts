// Phase 7.1: OAuth Service for Job Board Integrations
import crypto from 'crypto';
import { OAuthConfig, UserJobBoardConnection } from '../types/jobBoard';

export class JobBoardOAuthService {
  private configs: Map<string, OAuthConfig> = new Map();

  constructor() {
    this.initializeConfigs();
  }

  private initializeConfigs() {
    // LinkedIn OAuth Configuration
    if (process.env.LINKEDIN_CLIENT_ID) {
      this.configs.set('linkedin', {
        provider: 'linkedin',
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.BACKEND_URL}/api/oauth/linkedin/callback`,
        authorization_url: 'https://www.linkedin.com/oauth/v2/authorization',
        token_url: 'https://www.linkedin.com/oauth/v2/accessToken',
        scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
      });
    }

    // Indeed OAuth Configuration
    if (process.env.INDEED_CLIENT_ID) {
      this.configs.set('indeed', {
        provider: 'indeed',
        client_id: process.env.INDEED_CLIENT_ID,
        client_secret: process.env.INDEED_CLIENT_SECRET!,
        redirect_uri: `${process.env.BACKEND_URL}/api/oauth/indeed/callback`,
        authorization_url: 'https://secure.indeed.com/oauth/v2/authorize',
        token_url: 'https://apis.indeed.com/oauth/v2/tokens',
        scopes: ['employer_access']
      });
    }

    // Add more providers as needed
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(provider: string, userId: string): string {
    const config = this.configs.get(provider);
    if (!config) {
      throw new Error(`OAuth configuration not found for provider: ${provider}`);
    }

    const state = this.generateState(userId, provider);
    const params = new URLSearchParams({
      client_id: config.client_id,
      redirect_uri: config.redirect_uri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state
    });

    return `${config.authorization_url}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    provider: string,
    code: string
  ): Promise<{ access_token: string; refresh_token?: string; expires_in: number }> {
    const config = this.configs.get(provider);
    if (!config) {
      throw new Error(`OAuth configuration not found for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri
    });

    const response = await fetch(config.token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(
    provider: string,
    refreshToken: string
  ): Promise<{ access_token: string; expires_in: number }> {
    const config = this.configs.get(provider);
    if (!config) {
      throw new Error(`OAuth configuration not found for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.client_id,
      client_secret: config.client_secret
    });

    const response = await fetch(config.token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Encrypt sensitive tokens before storing
   */
  encryptToken(token: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt tokens when retrieving
   */
  decryptToken(encryptedToken: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate secure state parameter
   */
  private generateState(userId: string, provider: string): string {
    const data = `${userId}:${provider}:${Date.now()}`;
    return Buffer.from(data).toString('base64url');
  }

  /**
   * Verify and parse state parameter
   */
  verifyState(state: string): { userId: string; provider: string; timestamp: number } {
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    const [userId, provider, timestamp] = decoded.split(':');
    
    // Verify state is not older than 10 minutes
    const age = Date.now() - parseInt(timestamp);
    if (age > 10 * 60 * 1000) {
      throw new Error('State parameter expired');
    }
    
    return { userId, provider, timestamp: parseInt(timestamp) };
  }

  /**
   * Check if provider is configured
   */
  isProviderConfigured(provider: string): boolean {
    return this.configs.has(provider);
  }

  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): string[] {
    return Array.from(this.configs.keys());
  }
}

export const jobBoardOAuthService = new JobBoardOAuthService();
