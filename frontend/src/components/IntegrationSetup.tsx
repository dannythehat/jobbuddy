import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Google as GoogleIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

interface QuickSetupStatus {
  calendar: boolean;
  email: boolean;
  completionPercentage: number;
  nextSteps: string[];
}

interface IntegrationSetupProps {
  onComplete?: () => void;
  showOnlyIfIncomplete?: boolean;
}

const IntegrationSetup: React.FC<IntegrationSetupProps> = ({ 
  onComplete, 
  showOnlyIfIncomplete = false 
}) => {
  const [status, setStatus] = useState<QuickSetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/integrations/quick-setup', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch setup status');
      }

      const result = await response.json();
      setStatus(result.data);
    } catch (error) {
      console.error('Error fetching setup status:', error);
      setError('Failed to load setup status');
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (provider: string) => {
    try {
      setConnecting(provider);
      setError(null);

      const token = localStorage.getItem('token');
      const endpoint = provider === 'calendar' 
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  // Hide if complete and showOnlyIfIncomplete is true
  if (showOnlyIfIncomplete && status.completionPercentage === 100) {
    return null;
  }

  return (
    <Card sx={{ 
      background: status.completionPercentage === 100 
        ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' 
        : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
      color: 'white',
      mb: 3
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {status.completionPercentage === 100 ? '🎉 Setup Complete!' : '⚡ Quick Setup'}
          </Typography>
          <Chip 
            label={`${status.completionPercentage}% Complete`} 
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>

        {status.completionPercentage < 100 && (
          <>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Connect your accounts for the full JobBuddy experience
            </Typography>

            <LinearProgress 
              variant="determinate" 
              value={status.completionPercentage} 
              sx={{ 
                mb: 3, 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }} 
            />
          </>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {!status.calendar && (
            <Button
              variant="contained"
              startIcon={connecting === 'calendar' ? <CircularProgress size={16} /> : <CalendarIcon />}
              onClick={() => connectIntegration('calendar')}
              disabled={connecting === 'calendar'}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {connecting === 'calendar' ? 'Connecting...' : 'Connect Calendar'}
            </Button>
          )}

          {!status.email && (
            <Button
              variant="contained"
              startIcon={connecting === 'email' ? <CircularProgress size={16} /> : <EmailIcon />}
              onClick={() => connectIntegration('email')}
              disabled={connecting === 'email'}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {connecting === 'email' ? 'Connecting...' : 'Connect Email'}
            </Button>
          )}

          {status.completionPercentage === 100 && onComplete && (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={onComplete}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Continue
            </Button>
          )}
        </Box>

        {status.completionPercentage === 100 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              You're all set! JobBuddy will now automatically manage your job applications.
            </Typography>
          </Box>
        ) : (
          status.nextSteps.length > 0 && (
            <List dense sx={{ mt: 1 }}>
              {status.nextSteps.map((step, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AutoAwesomeIcon sx={{ color: 'white', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={step} 
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontSize: '0.875rem',
                        opacity: 0.9
                      } 
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationSetup;