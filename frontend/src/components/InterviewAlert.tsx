import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
  Stack,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

interface InterviewAlertProps {
  open: boolean;
  onClose: () => void;
  response: {
    id: string;
    subject: string;
    sender: string;
    senderName?: string;
    content: string;
    extractedData?: {
      interviewDate?: string;
      interviewTime?: string;
      interviewLocation?: string;
      interviewType?: 'phone' | 'video' | 'in_person' | 'panel';
      interviewers?: string[];
      nextSteps?: string;
      deadline?: string;
    };
    application?: {
      job?: {
        title: string;
        company: string;
        location: string;
      };
    };
  };
  onSchedule: (action: 'accept' | 'decline' | 'reschedule', options?: any) => Promise<void>;
}

const InterviewAlert: React.FC<InterviewAlertProps> = ({
  open,
  onClose,
  response,
  onSchedule
}) => {
  const [selectedAction, setSelectedAction] = useState<'accept' | 'decline' | 'reschedule' | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [alternativeTimes, setAlternativeTimes] = useState<Array<{ date: string; time: string }>>([
    { date: '', time: '' }
  ]);
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [reminderSettings, setReminderSettings] = useState([
    { type: 'email', timing: 1440, enabled: true }, // 24 hours
    { type: 'push', timing: 60, enabled: true },    // 1 hour
    { type: 'push', timing: 15, enabled: true },    // 15 minutes
  ]);
  const [loading, setLoading] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreview, setEmailPreview] = useState<any>(null);

  const extractedData = response.extractedData;
  const job = response.application?.job;

  const handleActionSelect = (action: 'accept' | 'decline' | 'reschedule') => {
    setSelectedAction(action);
    if (action !== 'reschedule') {
      generateEmailPreview(action);
    }
  };

  const generateEmailPreview = async (action: 'accept' | 'decline' | 'reschedule') => {
    try {
      const requestBody = {
        responseId: response.id,
        action,
        tone: 'professional',
        userPreferences: {
          name: 'User', // This would come from user context
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        ...(action === 'reschedule' && {
          rescheduleOptions: {
            reason: rescheduleReason,
            alternativeTimes: alternativeTimes.filter(alt => alt.date && alt.time),
          }
        })
      };

      const response_api = await fetch('/api/interviews/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response_api.ok) {
        const data = await response_api.json();
        setEmailPreview(data.data);
        setShowEmailPreview(true);
      }
    } catch (error) {
      console.error('Error generating email preview:', error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      const options: any = {
        calendarPreferences: calendarEnabled ? {
          provider: 'google',
          reminders: reminderSettings.filter(r => r.enabled).map(r => ({
            type: r.type,
            timing: r.timing,
          })),
        } : undefined,
        userPreferences: {
          name: 'User', // This would come from user context
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      if (selectedAction === 'reschedule') {
        options.rescheduleOptions = {
          reason: rescheduleReason,
          alternativeTimes: alternativeTimes.filter(alt => alt.date && alt.time),
        };
      }

      await onSchedule(selectedAction, options);
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAlternativeTime = () => {
    setAlternativeTimes([...alternativeTimes, { date: '', time: '' }]);
  };

  const removeAlternativeTime = (index: number) => {
    setAlternativeTimes(alternativeTimes.filter((_, i) => i !== index));
  };

  const updateAlternativeTime = (index: number, field: 'date' | 'time', value: string) => {
    const updated = [...alternativeTimes];
    updated[index][field] = value;
    setAlternativeTimes(updated);
  };

  const getInterviewIcon = (type?: string) => {
    switch (type) {
      case 'video': return <VideoCallIcon color="primary" />;
      case 'phone': return <PhoneIcon color="primary" />;
      case 'in_person': return <BusinessIcon color="primary" />;
      default: return <EventIcon color="primary" />;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Interview Invitation Detected!</Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Interview Details */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Interview Details
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Position"
                            secondary={job?.title || 'Not specified'}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemIcon>
                            <BusinessIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Company"
                            secondary={job?.company || 'Not specified'}
                          />
                        </ListItem>
                        
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="From"
                            secondary={response.senderName || response.sender}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <List dense>
                        {extractedData?.interviewDate && (
                          <ListItem>
                            <ListItemIcon>
                              <EventIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Date & Time"
                              secondary={`${format(parseISO(extractedData.interviewDate), 'PPpp')} ${extractedData.interviewTime || ''}`}
                            />
                          </ListItem>
                        )}
                        
                        {extractedData?.interviewLocation && (
                          <ListItem>
                            <ListItemIcon>
                              <LocationIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Location"
                              secondary={extractedData.interviewLocation}
                            />
                          </ListItem>
                        )}
                        
                        {extractedData?.interviewType && (
                          <ListItem>
                            <ListItemIcon>
                              {getInterviewIcon(extractedData.interviewType)}
                            </ListItemIcon>
                            <ListItemText
                              primary="Type"
                              secondary={extractedData.interviewType.replace('_', ' ')}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>

                  {extractedData?.nextSteps && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Next Steps:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {extractedData.nextSteps}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Action Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                How would you like to respond?
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card 
                    variant={selectedAction === 'accept' ? 'elevation' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedAction === 'accept' ? '2px solid' : '1px solid',
                      borderColor: selectedAction === 'accept' ? 'success.main' : 'divider',
                    }}
                    onClick={() => handleActionSelect('accept')}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6" color="success.main">
                        Accept
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confirm the interview time and add to calendar
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card 
                    variant={selectedAction === 'reschedule' ? 'elevation' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedAction === 'reschedule' ? '2px solid' : '1px solid',
                      borderColor: selectedAction === 'reschedule' ? 'warning.main' : 'divider',
                    }}
                    onClick={() => handleActionSelect('reschedule')}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <ScheduleIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h6" color="warning.main">
                        Reschedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Request alternative times
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card 
                    variant={selectedAction === 'decline' ? 'elevation' : 'outlined'}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedAction === 'decline' ? '2px solid' : '1px solid',
                      borderColor: selectedAction === 'decline' ? 'error.main' : 'divider',
                    }}
                    onClick={() => handleActionSelect('decline')}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CloseIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
                      <Typography variant="h6" color="error.main">
                        Decline
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Politely decline the interview
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Reschedule Options */}
            {selectedAction === 'reschedule' && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Reschedule Details
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Reason for rescheduling"
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      placeholder="e.g., Schedule conflict, prior commitment"
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Alternative Times
                    </Typography>
                    
                    {alternativeTimes.map((alt, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <TextField
                          type="date"
                          label="Date"
                          value={alt.date}
                          onChange={(e) => updateAlternativeTime(index, 'date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          type="time"
                          label="Time"
                          value={alt.time}
                          onChange={(e) => updateAlternativeTime(index, 'time', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{ flex: 1 }}
                        />
                        {alternativeTimes.length > 1 && (
                          <IconButton onClick={() => removeAlternativeTime(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addAlternativeTime}
                      variant="outlined"
                      size="small"
                    >
                      Add Alternative Time
                    </Button>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => generateEmailPreview('reschedule')}
                        disabled={!rescheduleReason || alternativeTimes.every(alt => !alt.date || !alt.time)}
                      >
                        Preview Email
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Calendar & Reminder Settings */}
            {selectedAction === 'accept' && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Calendar & Reminders
                    </Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={calendarEnabled}
                          onChange={(e) => setCalendarEnabled(e.target.checked)}
                        />
                      }
                      label="Add to Google Calendar"
                    />
                    
                    {calendarEnabled && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Reminder Settings
                        </Typography>
                        
                        {reminderSettings.map((reminder, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={reminder.enabled}
                                  onChange={(e) => {
                                    const updated = [...reminderSettings];
                                    updated[index].enabled = e.target.checked;
                                    setReminderSettings(updated);
                                  }}
                                />
                              }
                              label={`${reminder.type === 'email' ? 'Email' : 'Push'} - ${
                                reminder.timing >= 1440 
                                  ? `${reminder.timing / 1440} day(s) before`
                                  : reminder.timing >= 60
                                  ? `${reminder.timing / 60} hour(s) before`
                                  : `${reminder.timing} minute(s) before`
                              }`}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          
          {showEmailPreview && emailPreview && (
            <Button
              onClick={() => setShowEmailPreview(false)}
              variant="outlined"
            >
              Edit Response
            </Button>
          )}
          
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedAction || loading}
            startIcon={loading ? <ScheduleIcon /> : undefined}
          >
            {loading ? 'Processing...' : 'Confirm & Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={showEmailPreview} onClose={() => setShowEmailPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 1 }} />
            Email Preview
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {emailPreview && (
            <Box>
              <TextField
                fullWidth
                label="Subject"
                value={emailPreview.emailResponse?.subject || ''}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                  {emailPreview.emailResponse?.body || ''}
                </Typography>
              </Paper>
              
              {emailPreview.validation?.warnings?.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Warnings:</Typography>
                  <ul>
                    {emailPreview.validation.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowEmailPreview(false)}>
            Edit
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InterviewAlert;

