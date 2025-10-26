import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Work,
  LocationOn,
  AttachMoney,
  Business,
  Star,
  StarBorder,
  Launch,
  FilterList,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  requiredSkills?: string[];
  experienceLevel?: string;
  postedDate: string;
  applicationUrl: string;
  status: string;
}

interface JobMatch {
  jobId: string;
  score: number;
  matchReasons: string[];
  job: Job;
}

const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryMinFilter, setSalaryMinFilter] = useState('');

  useEffect(() => {
    if (activeTab === 0) {
      fetchMatchedJobs();
    } else {
      fetchAllJobs();
    }
  }, [activeTab]);

  const fetchMatchedJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatchedJobs(data.data.matches);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch matched jobs');
      }
    } catch (err) {
      setError('Error fetching matched jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationFilter) params.append('location', locationFilter);
      if (jobTypeFilter) params.append('jobType', jobTypeFilter);
      if (salaryMinFilter) params.append('salaryMin', salaryMinFilter);

      const response = await fetch(`/api/jobs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.data.jobs);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      setError('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const createSampleJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/sample', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Sample jobs created successfully!');
        if (activeTab === 0) {
          fetchMatchedJobs();
        } else {
          fetchAllJobs();
        }
      } else {
        setError('Failed to create sample jobs');
      }
    } catch (err) {
      setError('Error creating sample jobs');
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `${formatter.format(min)}+`;
    } else {
      return `Up to ${formatter.format(max!)}`;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'default';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    if (score >= 0.4) return 'Fair Match';
    return 'Basic Match';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const applyFilters = () => {
    fetchAllJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryMinFilter('');
    fetchAllJobs();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Job Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover jobs that match your skills and preferences.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => activeTab === 0 ? fetchMatchedJobs() : fetchAllJobs()}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={createSampleJobs}
          >
            Create Sample Jobs
          </Button>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab 
            label="Matched Jobs" 
            icon={<TrendingUp />} 
            iconPosition="start"
          />
          <Tab 
            label="All Jobs" 
            icon={<Work />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Filters for All Jobs tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, company..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="City, state, or remote"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  label="Job Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Min Salary"
                type="number"
                value={salaryMinFilter}
                onChange={(e) => setSalaryMinFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={applyFilters}>
                  Apply
                </Button>
                <Button variant="outlined" onClick={clearFilters}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading jobs...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Matched Jobs Tab */}
          {activeTab === 0 && (
            <>
              {matchedJobs.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    No matched jobs found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Make sure you have set your job preferences and try creating some sample jobs.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={createSampleJobs}
                  >
                    Create Sample Jobs
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {matchedJobs.map((match) => (
                    <Grid item xs={12} md={6} key={match.jobId}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                              {match.job.title}
                            </Typography>
                            <Chip
                              label={`${Math.round(match.score * 100)}% Match`}
                              color={getMatchScoreColor(match.score) as any}
                              size="small"
                            />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {match.job.company}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {match.job.location}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AttachMoney sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatSalary(match.job.salaryMin, match.job.salaryMax, match.job.salaryCurrency)}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {match.job.description.substring(0, 150)}...
                          </Typography>

                          {match.matchReasons.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                                Why this matches:
                              </Typography>
                              {match.matchReasons.slice(0, 2).map((reason, index) => (
                                <Typography key={index} variant="body2" color="success.main" sx={{ fontSize: '0.875rem' }}>
                                  • {reason}
                                </Typography>
                              ))}
                            </Box>
                          )}

                          {match.job.requiredSkills && match.job.requiredSkills.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {match.job.requiredSkills.slice(0, 4).map((skill, index) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {match.job.requiredSkills.length > 4 && (
                                <Chip
                                  label={`+${match.job.requiredSkills.length - 4} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </CardContent>

                        <CardActions>
                          <Button size="small" onClick={() => handleJobClick(match.job)}>
                            View Details
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<Launch />}
                            href={match.job.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {/* All Jobs Tab */}
          {activeTab === 1 && (
            <>
              {jobs.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    No jobs found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your filters or create some sample jobs to get started.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={createSampleJobs}
                  >
                    Create Sample Jobs
                  </Button>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {jobs.map((job) => (
                    <Grid item xs={12} md={6} key={job.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {job.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.company}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.location}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AttachMoney sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {job.description.substring(0, 150)}...
                          </Typography>

                          {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {job.requiredSkills.slice(0, 4).map((skill, index) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {job.requiredSkills.length > 4 && (
                                <Chip
                                  label={`+${job.requiredSkills.length - 4} more`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </CardContent>

                        <CardActions>
                          <Button size="small" onClick={() => handleJobClick(job)}>
                            View Details
                          </Button>
                          <Button 
                            size="small" 
                            startIcon={<Launch />}
                            href={job.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </>
      )}

      {/* Job Details Dialog */}
      <Dialog open={jobDialogOpen} onClose={() => setJobDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedJob && (
          <>
            <DialogTitle>
              <Typography variant="h5">{selectedJob.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedJob.company} • {selectedJob.location}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Job Details
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedJob.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Job Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedJob.jobType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Experience Level
                    </Typography>
                    <Typography variant="body1">
                      {selectedJob.experienceLevel || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Salary Range
                    </Typography>
                    <Typography variant="body1">
                      {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency)}
                    </Typography>
                  </Grid>
                </Grid>

                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Required Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedJob.requiredSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setJobDialogOpen(false)}>
                Close
              </Button>
              <Button 
                variant="contained"
                startIcon={<Launch />}
                href={selectedJob.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default JobsPage;
