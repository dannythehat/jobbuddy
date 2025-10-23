import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Google as GoogleIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

interface Integration {
  provider: string;
  connected: boolean;
  email?: string;
  name?: string;
  lastSync?: string;
  error?: string;
  permissions: string[];
}

interface QuickSetupStatus {
  calendar: boolean;
  email: boolean;
  completionPercentage: number;
  nextSteps: string[];
}

const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [quickSetup, setQuickSetup] = useState<QuickSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settingsDialog, setSettingsDialog] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
    fetchQuickSetup();
    
    // Handle OAuth callback results
    const urlParams = new URLSearchParams(window.location.search);
    const callbackError = urlParams.get('error');
    const callbackSuccess = urlParams.get('success');
    const provider = urlParams.get('provider');

    if (callbackError) {
      setError(`Connection failed: ${callbackError}`);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (callbackSuccess && provider) {
      setSuccess(`Successfully connected ${provider.replace('_', ' ')}!`);
      fetchIntegrations();
      fetchQuickSetup();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchIntegrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/integrations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch integrations');
      }

      const result = await response.json();
      setIntegrations(result.data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickSetup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/integrations/quick-setup', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quick setup status');
      }

      const result = await response.json();
      setQuickSetup(result.data);
    } catch (error) {
      console.error('Error fetching quick setup:', error);
    }
  };

  const connectIntegration = async (provider: string) => {
    try {
      setConnecting(provider);
      setError(null);

      const token = localStorage.getItem('token');
      const endpoint = provider === 'google_calendar' 
        ? '/api/integrations/google/calendar/connect'
        : '/api/integrations/google/gmail/connect';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to initiate connection');
      }

      const result = await response.json();
      
      // Redirect to OAuth URL
      window.location.href = result.data.authUrl;
    } catch (error) {
      console.error('Error connecting integration:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect');
      setConnecting(null);
    }
  };

  const disconnectIntegration = async (provider: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/integrations/${provider}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setSuccess(`Successfully disconnected ${provider.replace('_', ' ')}`);
      fetchIntegrations();
      fetchQuickSetup();
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect');
    }
  };

  const testIntegration = async (provider: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/integrations/${provider}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Test failed');
      }

      const result = await response.json();
      if (result.data.working) {
        setSuccess(`${provider.replace('_', ' ')} is working correctly!`);
      } else {
        setError(`${provider.replace('_', ' ')} connection test failed`);
      }
    } catch (error) {
      console.error('Error testing integration:', error);
      setError(error instanceof Error ? error.message : 'Test failed');
    }
  };

  const getProviderIcon = (provider: string) => {
    if (provider.includes('google')) return <GoogleIcon />;
    if (provider.includes('calendar')) return <CalendarIcon />;
    if (provider.includes('email') || provider.includes('gmail')) return <EmailIcon />;
    return <LinkIcon />;
  };

  const getProviderName = (provider: string) => {
    const names: { [key: string]: string } = {
      'google_calendar': 'Google Calendar',
      'google_gmail': 'Google Gmail',
      'outlook_calendar': 'Outlook Calendar',
      'outlook_email': 'Outlook Email'
    };
    return names[provider] || provider;
  };

  const getProviderDescription = (provider: string) => {
    const descriptions: { [key: string]: string } = {
      'google_calendar': 'Automatically schedule interviews and sync calendar events',
      'google_gmail': 'Monitor job responses and send automated follow-ups',
      'outlook_calendar': 'Sync with Outlook calendar for interview scheduling',
      'outlook_email': 'Connect Outlook email for response tracking'
    };
    return descriptions[provider] || 'Connect this service to JobBuddy';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Integrations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect your email and calendar for seamless job application automation
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}

      {/* Quick Setup Progress */}
      {quickSetup && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Quick Setup Progress
              </Typography>
              <Chip 
                label={`${quickSetup.completionPercentage}% Complete`} 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={quickSetup.completionPercentage} 
              sx={{ 
                mb: 2, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }} 
            />
            
            {quickSetup.nextSteps.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0.9 }}>
                  Next Steps:
                </Typography>
                <List dense>
                  {quickSetup.nextSteps.map((step, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <AutoAwesomeIcon sx={{ color: 'white', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={step} 
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Integration Cards */}
      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} md={6} key={integration.provider}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      backgroundColor: integration.connected ? 'success.light' : 'grey.100',
                      color: integration.connected ? 'success.contrastText' : 'text.secondary'
                    }}>
                      {getProviderIcon(integration.provider)}
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        {getProviderName(integration.provider)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getProviderDescription(integration.provider)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    icon={integration.connected ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={integration.connected ? 'Connected' : 'Not Connected'}
                    color={integration.connected ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                {integration.connected && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Connected as: <strong>{integration.email || integration.name}</strong>
                    </Typography>
                    {integration.lastSync && (
                      <Typography variant="caption" color="text.secondary">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                )}

                {integration.error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {integration.error}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {!integration.connected ? (
                    <Button
                      variant="contained"
                      startIcon={connecting === integration.provider ? <CircularProgress size={16} /> : <LinkIcon />}
                      onClick={() => connectIntegration(integration.provider)}
                      disabled={connecting === integration.provider}
                      sx={{ minWidth: 120 }}
                    >
                      {connecting === integration.provider ? 'Connecting...' : 'Connect'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => testIntegration(integration.provider)}
                        size="small"
                      >
                        Test
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        onClick={() => setSettingsDialog(integration.provider)}
                        size="small"
                      >
                        Settings
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LinkOffIcon />}
                        onClick={() => disconnectIntegration(integration.provider)}
                        size="small"
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </Box>

                {integration.connected && integration.permissions.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Permissions:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {integration.permissions.map((permission) => (
                        <Chip
                          key={permission}
                          label={permission.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Benefits Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Why Connect Your Accounts?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <ScheduleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Automatic Scheduling
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interview invitations are automatically added to your calendar with smart reminders
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Response Monitoring
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified instantly when employers respond to your applications
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <SpeedIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Time Savings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Save hours per week with automated email responses and calendar management
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Security Notice */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="info" icon={<SecurityIcon />}>
          <AlertTitle>Your Privacy is Protected</AlertTitle>
          We use industry-standard OAuth 2.0 for secure connections. Your credentials are never stored, 
          and you can revoke access at any time. All data is encrypted and handled according to our privacy policy.
        </Alert>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={!!settingsDialog} onClose={() => setSettingsDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Integration Settings - {settingsDialog ? getProviderName(settingsDialog) : ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-sync enabled"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Automatically sync data every 15 minutes
            </Typography>
            
            <TextField
              fullWidth
              label="Sync Frequency (minutes)"
              type="number"
              defaultValue={15}
              sx={{ mb: 2 }}
            />
            
            {settingsDialog?.includes('calendar') && (
              <>
                <TextField
                  fullWidth
                  label="Default reminder (minutes before)"
                  type="number"
                  defaultValue={60}
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Create calendar events for interviews"
                />
              </>
            )}
            
            {settingsDialog?.includes('gmail') && (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Email signature"
                  placeholder="Best regards,\nYour Name"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Monitor job application responses"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsDialog(null)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IntegrationsPage;