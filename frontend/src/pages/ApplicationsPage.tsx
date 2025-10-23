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
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon
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
  totalApplications: number;
  submittedApplications: number;
  responseRate: number;
}

interface CV {
  id: string;
  filename: string;
  isDefault: boolean;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // Form states
  const [cvs, setCvs] = useState<CV[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedCvId, setSelectedCvId] = useState('');
  const [applicationNotes, setApplicationNotes] = useState('');
  
  // AI Generation states
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    tone: 'professional',
    length: 'medium',
    includeCustomResume: false,
    focusAreas: [] as string[]
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
    fetchCVs();
    fetchJobs();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data);
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

  const fetchCVs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cvs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCvs(data.data);
        // Set default CV if available
        const defaultCV = data.data.find((cv: CV) => cv.isDefault);
        if (defaultCV) {
          setSelectedCvId(defaultCV.id);
        }
      }
    } catch (err) {
      console.error('Error fetching CVs:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCreateApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: selectedJobId,
          cvId: selectedCvId,
          notes: applicationNotes
        })
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        fetchApplications();
        fetchStats();
        // Reset form
        setSelectedJobId('');
        setSelectedCvId('');
        setApplicationNotes('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create application');
      }
    } catch (err) {
      setError('Error creating application');
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedJobId || !selectedCvId) return;

    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: selectedJobId,
          cvId: selectedCvId,
          options: generationOptions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.data);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to generate content');
      }
    } catch (err) {
      setError('Error generating content');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        fetchApplications();
        fetchStats();
        setEditDialogOpen(false);
        setSelectedApplication(null);
      } else {
        setError('Failed to update application');
      }
    } catch (err) {
      setError('Error updating application');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchApplications();
        fetchStats();
      } else {
        setError('Failed to delete application');
      }
    } catch (err) {
      setError('Error deleting application');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
          My Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your job applications with AI-powered content generation.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
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
                  <SendIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.submittedApplications}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted
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
                  <ScheduleIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {stats.statusBreakdown.find(s => s.status === 'interviewing')?.count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interviewing
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          New Application
        </Button>
        <Button
          variant="outlined"
          startIcon={<AIIcon />}
          onClick={() => setGenerateDialogOpen(true)}
        >
          Generate with AI
        </Button>
      </Box>

      {/* Applications List */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="All Applications" />
          <Tab label="Drafts" />
          <Tab label="Submitted" />
          <Tab label="Active" />
        </Tabs>

        <Grid container spacing={3}>
          {applications
            .filter(app => {
              if (tabValue === 1) return app.status === 'draft';
              if (tabValue === 2) return app.status === 'submitted';
              if (tabValue === 3) return ['interviewing', 'offered'].includes(app.status);
              return true;
            })
            .map((application) => (
              <Grid item xs={12} md={6} key={application.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {application.job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {application.job.company} • {application.job.location}
                        </Typography>
                      </Box>
                      <Chip
                        label={application.status}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      CV: {application.cv.filename}
                    </Typography>

                    {application.submissionDate && (
                      <Typography variant="body2" color="text.secondary">
                        Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                      </Typography>
                    )}

                    {application.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {application.notes.substring(0, 100)}
                        {application.notes.length > 100 && '...'}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelectedApplication(application);
                        setEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteApplication(application.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        {applications.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No applications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first application to get started!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create Application Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Application</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Job</InputLabel>
              <Select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                label="Select Job"
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title} - {job.company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select CV</InputLabel>
              <Select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                label="Select CV"
              >
                {cvs.map((cv) => (
                  <MenuItem key={cv.id} value={cv.id}>
                    {cv.filename} {cv.isDefault && '(Default)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes (Optional)"
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              placeholder="Add any notes about this application..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateApplication}
            variant="contained"
            disabled={!selectedJobId || !selectedCvId}
          >
            Create Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Generation Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AIIcon sx={{ mr: 1 }} />
            Generate Application with AI
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select Job</InputLabel>
                  <Select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    label="Select Job"
                  >
                    {jobs.map((job) => (
                      <MenuItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Select CV</InputLabel>
                  <Select
                    value={selectedCvId}
                    onChange={(e) => setSelectedCvId(e.target.value)}
                    label="Select CV"
                  >
                    {cvs.map((cv) => (
                      <MenuItem key={cv.id} value={cv.id}>
                        {cv.filename} {cv.isDefault && '(Default)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Generation Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Tone</InputLabel>
                      <Select
                        value={generationOptions.tone}
                        onChange={(e) => setGenerationOptions({
                          ...generationOptions,
                          tone: e.target.value
                        })}
                        label="Tone"
                      >
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="enthusiastic">Enthusiastic</MenuItem>
                        <MenuItem value="conversational">Conversational</MenuItem>
                        <MenuItem value="formal">Formal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Length</InputLabel>
                      <Select
                        value={generationOptions.length}
                        onChange={(e) => setGenerationOptions({
                          ...generationOptions,
                          length: e.target.value
                        })}
                        label="Length"
                      >
                        <MenuItem value="short">Short</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="long">Long</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={generationOptions.includeCustomResume}
                          onChange={(e) => setGenerationOptions({
                            ...generationOptions,
                            includeCustomResume: e.target.checked
                          })}
                        />
                      }
                      label="Custom Resume"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleGenerateContent}
                disabled={!selectedJobId || !selectedCvId || generating}
                startIcon={generating ? <CircularProgress size={20} /> : <AIIcon />}
              >
                {generating ? 'Generating...' : 'Generate Content'}
              </Button>
            </Box>

            {generatedContent && (
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Generated Content
                </Typography>

                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Cover Letter</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ position: 'relative' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        value={generatedContent.coverLetter}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                          onClick={() => copyToClipboard(generatedContent.coverLetter)}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Application Notes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      {generatedContent.applicationNotes}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Key Points</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {generatedContent.keyPoints?.map((point: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TrendingUpIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Close</Button>
          {generatedContent && (
            <Button
              variant="contained"
              onClick={() => {
                // Create application with generated content
                setApplicationNotes(generatedContent.applicationNotes);
                setGenerateDialogOpen(false);
                setCreateDialogOpen(true);
              }}
            >
              Create Application
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Application</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.job.title} - {selectedApplication.job.company}
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedApplication.status}
                  onChange={(e) => setSelectedApplication({
                    ...selectedApplication,
                    status: e.target.value as any
                  })}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="interviewing">Interviewing</MenuItem>
                  <MenuItem value="offered">Offered</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="withdrawn">Withdrawn</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Cover Letter"
                value={selectedApplication.coverLetter || ''}
                onChange={(e) => setSelectedApplication({
                  ...selectedApplication,
                  coverLetter: e.target.value
                })}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={selectedApplication.notes || ''}
                onChange={(e) => setSelectedApplication({
                  ...selectedApplication,
                  notes: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedApplication && handleUpdateApplication(selectedApplication.id, selectedApplication)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationsPage;