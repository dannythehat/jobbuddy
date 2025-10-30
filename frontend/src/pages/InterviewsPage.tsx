import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Event as EventIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Notes as NotesIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import parseISO from 'date-fns/parseISO';

interface Interview {
  id: string;
  title: string;
  description?: string;
  scheduledDate: string;
  duration: number;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  type: 'phone' | 'video' | 'in_person' | 'panel' | 'technical' | 'behavioral';
  format: 'one_on_one' | 'panel' | 'group' | 'presentation' | 'technical_test';
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  userResponse?: 'accepted' | 'declined' | 'reschedule_requested';
  calendarSynced: boolean;
  interviewers: Array<{
    name: string;
    title?: string;
    email?: string;
  }>;
  preparationNotes?: string;
  interviewNotes?: string;
  outcome?: 'positive' | 'negative' | 'neutral' | 'pending';
  application?: {
    id: string;
    job?: {
      title: string;
      company: string;
      location: string;
    };
  };
}

interface Analytics {
  statusStats: Array<{ status: string; count: number }>;
  typeStats: Array<{ type: string; count: number }>;
  upcomingCount: number;
  completedCount: number;
  timeline: Array<{ date: string; count: number }>;
}

const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    upcoming: '',
    search: '',
    page: 1,
    limit: 20,
  });

  const [, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Notes form
  const [notesForm, setNotesForm] = useState({
    notes: '',
    outcome: '',
    feedback: '',
    nextSteps: '',
    followUpDate: '',
  });
// eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchInterviews();
    fetchAnalytics();
  }, [filters]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/interviews?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews(data.data.interviews);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/interviews/analytics?timeframe=30', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCancelInterview = async (interviewId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason, sendNotification: true }),
      });

      if (response.ok) {
        await fetchInterviews();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedInterview) return;

    try {
      const response = await fetch(`/api/interviews/${selectedInterview.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          notes: notesForm.notes,
          outcome: notesForm.outcome,
          feedback: notesForm.feedback,
          nextSteps: notesForm.nextSteps,
          followUpDate: notesForm.followUpDate || undefined,
        }),
      });

      if (response.ok) {
        await fetchInterviews();
        setNotesDialogOpen(false);
        setNotesForm({
          notes: '',
          outcome: '',
          feedback: '',
          nextSteps: '',
          followUpDate: '',
        });
      }
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'secondary';
      case 'no_show': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCallIcon />;
      case 'phone': return <PhoneIcon />;
      case 'in_person': return <BusinessIcon />;
      case 'panel': return <PersonIcon />;
      default: return <EventIcon />;
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'warning';
      default: return 'default';
    }
  };

  const isUpcoming = (date: string) => {
    return isAfter(parseISO(date), new Date());
  };

  const = (date: string) => {
    return isBefore(parseISO(date), new Date());
  };

  const openNotesDialog = (interview: Interview) => {
    setSelectedInterview(interview);
    setNotesForm({
      notes: interview.interviewNotes || '',
      outcome: interview.outcome || '',
      feedback: '',
      nextSteps: '',
      followUpDate: '',
    });
    setNotesDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interview Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your scheduled interviews, track outcomes, and stay organized
      </Typography>

      {/* Analytics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Upcoming</Typography>
                </Box>
                <Typography variant="h4" color="primary.main">
                  {analytics.upcomingCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scheduled interviews
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Completed</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {analytics.completedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VideoCallIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Video Calls</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {analytics.typeStats.find(s => s.type === 'video')?.count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Most common type
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Success Rate</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {analytics.completedCount > 0 
                    ? Math.round((analytics.statusStats.find(s => s.status === 'completed')?.count || 0) / analytics.completedCount * 100)
                    : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search interviews..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="in_person">In Person</MenuItem>
                  <MenuItem value="panel">Panel</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Time</InputLabel>
                <Select
                  value={filters.upcoming}
                  onChange={(e) => setFilters({ ...filters, upcoming: e.target.value, page: 1 })}
                  label="Time"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Upcoming</MenuItem>
                  <MenuItem value="false">Past</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchInterviews}
                disabled={loading}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Interviews List */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {interviews.map((interview) => (
            <Grid item xs={12} key={interview.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 },
                  border: isUpcoming(interview.scheduledDate) && interview.status === 'confirmed' ? '2px solid' : '1px solid',
                  borderColor: isUpcoming(interview.scheduledDate) && interview.status === 'confirmed' ? 'primary.main' : 'divider',
                }}
                onClick={() => {
                  setSelectedInterview(interview);
                  setDetailsOpen(true);
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getTypeIcon(interview.type)}
                        <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                          {interview.title}
                        </Typography>
                        <Chip
                          label={interview.status}
                          color={getStatusColor(interview.status) as any}
                          size="small"
                        />
                        {interview.calendarSynced && (
                          <Tooltip title="Synced with calendar">
                            <CalendarTodayIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                          </Tooltip>
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {interview.application?.job?.title} at {interview.application?.job?.company}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        {format(parseISO(interview.scheduledDate), 'PPpp')} ({interview.duration} min)
                      </Typography>
                      
                      {interview.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {interview.location}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Interviewers:
                      </Typography>
                      {interview.interviewers.map((interviewer, index) => (
                        <Typography key={index} variant="body2">
                          {interviewer.name}
                          {interviewer.title && ` - ${interviewer.title}`}
                        </Typography>
                      ))}
                      
                      {interview.outcome && (
                        <Chip
                          label={interview.outcome}
                          color={getOutcomeColor(interview.outcome) as any}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {interview.status === 'completed' && (
                          <Button
                            size="small"
                            startIcon={<NotesIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openNotesDialog(interview);
                            }}
                          >
                            {interview.interviewNotes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                        )}
                        
                        {['pending', 'confirmed'].includes(interview.status) && isUpcoming(interview.scheduledDate) && (
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelInterview(interview.id, 'User cancelled');
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Interview Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedInterview && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Interview Details</Typography>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Interview Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Title"
                        secondary={selectedInterview.title}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Date & Time"
                        secondary={format(parseISO(selectedInterview.scheduledDate), 'PPpp')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Duration"
                        secondary={`${selectedInterview.duration} minutes`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Type"
                        secondary={selectedInterview.type.replace('_', ' ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          <Chip
                            label={selectedInterview.status}
                            color={getStatusColor(selectedInterview.status) as any}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Job Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Position"
                        secondary={selectedInterview.application?.job?.title}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Company"
                        secondary={selectedInterview.application?.job?.company}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Location"
                        secondary={selectedInterview.location || selectedInterview.application?.job?.location}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Interviewers
                  </Typography>
                  {selectedInterview.interviewers.map((interviewer, index) => (
                    <Typography key={index} variant="body2">
                      {interviewer.name}
                      {interviewer.title && ` - ${interviewer.title}`}
                      {interviewer.email && ` (${interviewer.email})`}
                    </Typography>
                  ))}
                </Grid>
                
                {selectedInterview.meetingUrl && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Meeting Link
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        <a href={selectedInterview.meetingUrl} target="_blank" rel="noopener noreferrer">
                          {selectedInterview.meetingUrl}
                        </a>
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {selectedInterview.preparationNotes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Preparation Notes
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedInterview.preparationNotes}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {selectedInterview.interviewNotes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Interview Notes
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedInterview.interviewNotes}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions>
              {selectedInterview.status === 'completed' && (
                <Button
                  onClick={() => {
                    setDetailsOpen(false);
                    openNotesDialog(selectedInterview);
                  }}
                  startIcon={<NotesIcon />}
                >
                  {selectedInterview.interviewNotes ? 'Edit Notes' : 'Add Notes'}
                </Button>
              )}
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onClose={() => setNotesDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Interview Notes & Outcome</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Interview Notes"
                value={notesForm.notes}
                onChange={(e) => setNotesForm({ ...notesForm, notes: e.target.value })}
                placeholder="How did the interview go? What questions were asked?"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Outcome</InputLabel>
                <Select
                  value={notesForm.outcome}
                  onChange={(e) => setNotesForm({ ...notesForm, outcome: e.target.value })}
                  label="Outcome"
                >
                  <MenuItem value="">Select outcome</MenuItem>
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Follow-up Date"
                value={notesForm.followUpDate}
                onChange={(e) => setNotesForm({ ...notesForm, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Feedback Received"
                value={notesForm.feedback}
                onChange={(e) => setNotesForm({ ...notesForm, feedback: e.target.value })}
                placeholder="Any feedback provided by the interviewer?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Next Steps"
                value={notesForm.nextSteps}
                onChange={(e) => setNotesForm({ ...notesForm, nextSteps: e.target.value })}
                placeholder="What are the next steps in the process?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNotes} variant="contained">
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty State */}
      {!loading && interviews.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No interviews found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your scheduled interviews will appear here once you receive interview invitations.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InterviewsPage;
