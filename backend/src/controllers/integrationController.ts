import { Request, Response } from 'express';
import { integrationService } from '../services/integrationService';

export class IntegrationController {
  
  async getIntegrations(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const integrations = await integrationService.getUserIntegrations(userId);
      
      res.json({
        success: true,
        data: integrations
      });
    } catch (error) {
      console.error('Error fetching integrations:', error);
      res.status(500).json({ 
        error: 'Failed to fetch integrations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getQuickSetupStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const status = await integrationService.getQuickSetupStatus(userId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error fetching quick setup status:', error);
      res.status(500).json({ 
        error: 'Failed to fetch setup status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async connectGoogleCalendar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { authUrl, state } = await integrationService.getGoogleCalendarAuthUrl(userId);
      
      res.json({
        success: true,
        data: { authUrl, state }
      });
    } catch (error) {
      console.error('Error getting Google Calendar auth URL:', error);
      res.status(500).json({ 
        error: 'Failed to initiate Google Calendar connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async connectGoogleGmail(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { authUrl, state } = await integrationService.getGoogleGmailAuthUrl(userId);
      
      res.json({
        success: true,
        data: { authUrl, state }
      });
    } catch (error) {
      console.error('Error getting Google Gmail auth URL:', error);
      res.status(500).json({ 
        error: 'Failed to initiate Google Gmail connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async handleGoogleCallback(req: Request, res: Response) {
    try {
      const { code, state, error } = req.query;

      if (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/integrations?error=${encodeURIComponent(error as string)}`);
      }

      if (!code || !state) {
        return res.redirect(`${process.env.FRONTEND_URL}/integrations?error=missing_parameters`);
      }

      const integration = await integrationService.handleGoogleCallback(code as string, state as string);
      
      res.redirect(`${process.env.FRONTEND_URL}/integrations?success=true&provider=${integration.provider}`);
    } catch (error) {
      console.error('Error handling Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/integrations?error=${encodeURIComponent('connection_failed')}`);
    }
  }

  async disconnectIntegration(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { provider } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await integrationService.disconnectIntegration(userId, provider);
      
      res.json({
        success: true,
        message: `${provider} disconnected successfully`
      });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      res.status(500).json({ 
        error: 'Failed to disconnect integration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async testIntegration(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { provider } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const isWorking = await integrationService.testIntegration(userId, provider);
      
      res.json({
        success: true,
        data: { working: isWorking }
      });
    } catch (error) {
      console.error('Error testing integration:', error);
      res.status(500).json({ 
        error: 'Failed to test integration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateIntegrationSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { provider } = req.params;
      const settings = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const integration = await integrationService.updateIntegrationSettings(userId, provider, settings);
      
      res.json({
        success: true,
        data: integration,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating integration settings:', error);
      res.status(500).json({ 
        error: 'Failed to update settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async refreshIntegration(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { provider } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const integration = await integrationService.getIntegration(userId, provider);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }

      const refreshedIntegration = await integrationService.refreshIntegrationTokens(integration.id);
      
      res.json({
        success: true,
        data: refreshedIntegration,
        message: 'Integration refreshed successfully'
      });
    } catch (error) {
      console.error('Error refreshing integration:', error);
      res.status(500).json({ 
        error: 'Failed to refresh integration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async healthCheck(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await integrationService.healthCheckUserIntegrations(userId);
      
      res.json({
        success: true,
        message: 'Health check completed'
      });
    } catch (error) {
      console.error('Error during health check:', error);
      res.status(500).json({ 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const integrationController = new IntegrationController();