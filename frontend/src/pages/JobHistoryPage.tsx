import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  InputAdornment,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  Work as WorkIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Meeting as MeetingIcon,
  Message as MessageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: string;
  status: 'draft' | 'submitted' | 'interviewing' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  submissionDate?: string;
  coverLetter?: string;
  notes?: string;
  responseDate?: string;
  responseType?: 'positive' | 'negative' | 'no_response';
  interviewDate?: string;
  interviewNotes?: string;
  offerDetails?: any;
  applicationMethod?: string;
  referralSource?: string;
  followUpDates?: string[];
  rejectionReason?: string;
  rejectionFeedback?: string;
  salaryOffered?: number;
  negotiationNotes?: string;
  statusHistory?: Array<{
    status: string;
    date: string;
    notes?: string;
  }>;
  communications?: Array<{
    date: string;
    type: 'email' | 'phone' | 'meeting' | 'message';
    direction: 'inbound' | 'outbound';
    subject?: string;
    summary: string;
  }>;
  jobBoardUrl?: string;
  jobBoardId?: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
  };
  cv: {
    id: string;
    filename: string;
    isDefault: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApplicationStats {
  statusBreakdown: Array<{ status: string; count: number }>;
  methodBreakdown: Array<{ applicationMethod: string; count: number }>;
  totalApplications: number;
  submittedApplications: number;
  interviewApplications: number;
  offerApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  recentApplications: number;
}

const JobHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  
  // Dialog states
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false);
  
  // Communication form
  const [communicationForm, setCommunicationForm] = useState({
    type: 'email' as 'email' | 'phone' | 'meeting' | 'message',
    direction: 'outbound' as 'inbound' | 'outbound',
    subject: '',
    summary: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [statusFilter, methodFilter, searchTerm, dateFromFilter, dateToFilter, page]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (methodFilter !== 'all') params.append('applicationMethod', methodFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (dateFromFilter) params.append('dateFrom', dateFromFilter);
      if (dateToFilter) params.append('dateTo', dateToFilter);
      
      const response = await fetch(`/api/applications?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data.applications);
        setTotalPages(data.data.pagination.pages);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchApplicationTimeline = async (applicationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${applicationId}/timeline`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.timeline;
      }
    } catch (err) {
      console.error('Error fetching timeline:', err);
    }
    return [];
  };

  const handleAddCommunication = async () => {
    if (!selectedApplication) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${selectedApplication.id}/communication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(communicationForm)
      });

      if (response.ok) {
        setCommunicationDialogOpen(false);
        setCommunicationForm({
          type: 'email',
          direction: 'outbound',
          subject: '',
          summary: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchApplications();
      } else {
        setError('Failed to add communication');
      }
    } catch (err) {
      setError('Error adding communication');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      draft: 'default',
      submitted: 'primary',
      interviewing: 'info',
      offered: 'success',
      accepted: 'success',
      rejected: 'error',
      withdrawn: 'warning'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <EditIcon />,
      submitted: <SendIcon />,
      interviewing: <ScheduleIcon />,
      offered: <CheckCircleIcon />,
      accepted: <CheckCircleIcon />,
      rejected: <CancelIcon />,
      withdrawn: <WarningIcon />
    };
    return icons[status as keyof typeof icons] || <WorkIcon />;
  };

  const getCommunicationIcon = (type: string) => {
    const icons = {
      email: <EmailIcon />,
      phone: <PhoneIcon />,
      meeting: <MeetingIcon />,
      message: <MessageIcon />
    };
    return icons[type as keyof typeof icons] || <MessageIcon />;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const filteredApplications = applications.filter(app => {
    if (tabValue === 1) return ['submitted', 'interviewing', 'offered'].includes(app.status);
    if (tabValue === 2) return app.status === 'interviewing';
    if (tabValue === 3) return app.status === 'rejected';
    if (tabValue === 4) return ['offered', 'accepted'].includes(app.status);
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Job Application History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all your job applications with detailed status updates and communications.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Enhanced Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WorkIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.totalApplications}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.responseRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Response Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ScheduleIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.interviewRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interview Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.offerRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Offer Rate
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="interviewing">Interviewing</MenuItem>
                <MenuItem value="offered">Offered</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="withdrawn">Withdrawn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                label="Method"
              >
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="direct">Direct</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="indeed">Indeed</MenuItem>
                <MenuItem value="company_website">Company Website</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setMethodFilter('all');
                setDateFromFilter('');
                setDateToFilter('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Applications List */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="All Applications" />
          <Tab label="Active" />
          <Tab label="Interviewing" />
          <Tab label="Rejected" />
          <Tab label="Offers" />
        </Tabs>

        <Grid container spacing={3}>
          {filteredApplications.map((application) => (
            <Grid item xs={12} key={application.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: getStatusColor(application.status), mr: 2 }}>
                          {getStatusIcon(application.status)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {application.job.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box display="flex" alignItems="center">
                              <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.company}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {application.job.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Chip
                          label={application.status}
                          color={getStatusColor(application.status)}
                          size="small"
                        />
                        {application.applicationMethod && (
                          <Chip
                            label={application.applicationMethod}
                            variant="outlined"
                            size="small"
                          />
                        )}
                        {application.referralSource && (
                          <Chip
                            label={`Referral: ${application.referralSource}`}
                            variant="outlined"
                            size="small"
                            color="info"
                          />
                        )}
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </Typography>
                          {application.submissionDate && (
                            <Typography variant="body2" color="text.secondary">
                              Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          {application.responseDate && (
                            <Typography variant="body2" color="text.secondary">
                              Response: {new Date(application.responseDate).toLocaleDateString()}
                            </Typography>
                          )}
                          {application.interviewDate && (
                            <Typography variant="body2" color="text.secondary">
                              Interview: {new Date(application.interviewDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>

                      {application.salaryOffered && (
                        <Box mt={1}>
                          <Typography variant="body2" color="success.main">
                            Salary Offered: ${application.salaryOffered.toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {application.rejectionReason && (
                        <Box mt={1}>
                          <Typography variant="body2" color="error.main">
                            Rejection Reason: {application.rejectionReason}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Salary Range: {formatSalary(application.job.salaryMin, application.job.salaryMax)}
                        </Typography>
                        
                        {application.communications && application.communications.length > 0 && (
                          <Box mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Communications: {application.communications.length}
                            </Typography>
                          </Box>
                        )}

                        {application.followUpDates && application.followUpDates.length > 0 && (
                          <Box mb={1}>
                            <Typography variant="body2" color="warning.main">
                              Follow-ups: {application.followUpDates.length}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {application.notes && (
                    <Box mt={2}>
                      <Divider sx={{ mb: 1 }} />
                      <Typography variant="body2">
                        <strong>Notes:</strong> {application.notes.substring(0, 200)}
                        {application.notes.length > 200 && '...'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<TimelineIcon />}
                    onClick={async () => {
                      setSelectedApplication(application);
                      setTimelineDialogOpen(true);
                    }}
                  >
                    Timeline
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedApplication(application);
                      setCommunicationDialogOpen(true);
                    }}
                  >
                    Add Communication
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      // Navigate to edit application
                      window.location.href = `/applications?edit=${application.id}`;
                    }}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredApplications.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No applications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or create a new application.
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ mx: 2, alignSelf: 'center' }}>
              Page {page} of {totalPages}
            </Typography>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Paper>

      {/* Timeline Dialog */}
      <Dialog open={timelineDialogOpen} onClose={() => setTimelineDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Application Timeline
          {selectedApplication && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedApplication.job.title} - {selectedApplication.job.company}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Timeline>
              {selectedApplication.statusHistory?.map((status, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(status.date).toLocaleDateString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getStatusColor(status.status) as any}>
                      {getStatusIcon(status.status)}
                    </TimelineDot>
                    {index < (selectedApplication.statusHistory?.length || 0) - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                    </Typography>
                    {status.notes && (
                      <Typography color="text.secondary">
                        {status.notes}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
              
              {selectedApplication.communications?.map((comm, index) => (
                <TimelineItem key={`comm-${index}`}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(comm.date).toLocaleDateString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="info">
                      {getCommunicationIcon(comm.type)}
                    </TimelineDot>
                    {index < (selectedApplication.communications?.length || 0) - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {comm.type} ({comm.direction})
                    </Typography>
                    {comm.subject && (
                      <Typography variant="subtitle2">
                        {comm.subject}
                      </Typography>
                    )}
                    <Typography color="text.secondary">
                      {comm.summary}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimelineDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Communication Dialog */}
      <Dialog open={communicationDialogOpen} onClose={() => setCommunicationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Communication</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={communicationForm.type}
                    onChange={(e) => setCommunicationForm({
                      ...communicationForm,
                      type: e.target.value as any
                    })}
                    label="Type"
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="message">Message</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Direction</InputLabel>
                  <Select
                    value={communicationForm.direction}
                    onChange={(e) => setCommunicationForm({
                      ...communicationForm,
                      direction: e.target.value as any
                    })}
                    label="Direction"
                  >
                    <MenuItem value="outbound">Outbound</MenuItem>
                    <MenuItem value="inbound">Inbound</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={communicationForm.date}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    date: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject (Optional)"
                  value={communicationForm.subject}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    subject: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Summary"
                  value={communicationForm.summary}
                  onChange={(e) => setCommunicationForm({
                    ...communicationForm,
                    summary: e.target.value
                  })}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommunicationDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddCommunication}
            variant="contained"
            disabled={!communicationForm.summary}
          >
            Add Communication
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobHistoryPage;