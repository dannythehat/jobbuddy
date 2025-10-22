import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Autocomplete,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Save,
  AutoAwesome,
  Work,
  LocationOn,
  AttachMoney,
  School,
  Code,
} from '@mui/icons-material';

interface JobPreferences {
  jobTitle: string[];
  location: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  industry?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  keywords?: string[];
  excludeKeywords?: string[];
}

interface CV {
  id: string;
  title: string;
  parsedData?: any;
  skills?: string[];
}

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState<JobPreferences>({
    jobTitle: [],
    location: [],
    remotePreference: 'any',
    jobType: ['full-time'],
    salaryCurrency: 'USD',
  });
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [suggestedPreferences, setSuggestedPreferences] = useState<JobPreferences | null>(null);

  // Common options
  const jobTitleOptions = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'UI Designer',
    'Mobile Developer', 'Cloud Engineer', 'Security Engineer', 'QA Engineer', 'Scrum Master'
  ];

  const locationOptions = [
    'Remote', 'United States', 'New York, NY', 'San Francisco, CA', 'Los Angeles, CA',
    'Chicago, IL', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Denver, CO', 'Atlanta, GA'
  ];

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Gaming',
    'Fintech', 'Biotech', 'Consulting', 'Media', 'Non-profit', 'Government'
  ];

  const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS',
    'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Git', 'HTML', 'CSS',
    'Angular', 'Vue.js', 'Express.js', 'Django', 'Flask', 'GraphQL', 'REST API'
  ];

  useEffect(() => {
    fetchPreferences();
    fetchCVs();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/preferences', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setPreferences(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCVs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cvs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCvs(data.data.filter((cv: CV) => cv.parsedData && cv.skills));
      }
    } catch (err) {
      console.error('Error fetching CVs:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSuccess('Job preferences saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save preferences');
      }
    } catch (err) {
      setError('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateFromCV = async (cvId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/preferences/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedPreferences(data.data);
        setGenerateDialogOpen(false);
        setSuccess('Job preferences generated from CV! Review and save to apply.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate preferences');
      }
    } catch (err) {
      setError('Error generating preferences from CV');
    }
  };

  const applySuggestedPreferences = () => {
    if (suggestedPreferences) {
      setPreferences({
        ...preferences,
        ...suggestedPreferences,
      });
      setSuggestedPreferences(null);
    }
  };

  const handleArrayFieldChange = (field: keyof JobPreferences, value: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldChange = (field: keyof JobPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Loading preferences...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Job Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Set your job search preferences to find the perfect opportunities.
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

        {suggestedPreferences && (
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={applySuggestedPreferences}>
                Apply Suggestions
              </Button>
            }
          >
            AI-generated preferences are ready! Click "Apply Suggestions" to use them.
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<AutoAwesome />}
            onClick={() => setGenerateDialogOpen(true)}
            disabled={cvs.length === 0}
          >
            Generate from CV
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving || preferences.jobTitle.length === 0}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Job Titles */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Work sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Job Titles</Typography>
            </Box>
            <Autocomplete
              multiple
              options={jobTitleOptions}
              value={preferences.jobTitle}
              onChange={(_, value) => handleArrayFieldChange('jobTitle', value)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add job titles..."
                  helperText="What positions are you looking for?"
                />
              )}
            />
          </Paper>
        </Grid>

        {/* Locations */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Locations</Typography>
            </Box>
            <Autocomplete
              multiple
              options={locationOptions}
              value={preferences.location}
              onChange={(_, value) => handleArrayFieldChange('location', value)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add locations..."
                  helperText="Where would you like to work?"
                />
              )}
            />
          </Paper>
        </Grid>

        {/* Remote Preference & Job Type */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Work Arrangement</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Remote Preference</InputLabel>
              <Select
                value={preferences.remotePreference}
                onChange={(e) => handleFieldChange('remotePreference', e.target.value)}
                label="Remote Preference"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="remote">Remote Only</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="onsite">On-site Only</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={['full-time', 'part-time', 'contract', 'internship']}
              value={preferences.jobType}
              onChange={(_, value) => handleArrayFieldChange('jobType', value as any)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job Types"
                  helperText="What type of employment?"
                />
              )}
            />
          </Paper>
        </Grid>

        {/* Salary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Salary Range</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={preferences.salaryCurrency || 'USD'}
                    onChange={(e) => handleFieldChange('salaryCurrency', e.target.value)}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Min Salary"
                  type="number"
                  value={preferences.salaryMin || ''}
                  onChange={(e) => handleFieldChange('salaryMin', parseInt(e.target.value) || undefined)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Max Salary"
                  type="number"
                  value={preferences.salaryMax || ''}
                  onChange={(e) => handleFieldChange('salaryMax', parseInt(e.target.value) || undefined)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Code sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Skills</Typography>
            </Box>
            <Autocomplete
              multiple
              options={skillOptions}
              value={preferences.skills || []}
              onChange={(_, value) => handleArrayFieldChange('skills', value)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add skills..."
                  helperText="What technologies and skills do you have?"
                />
              )}
            />
          </Paper>
        </Grid>

        {/* Experience & Education */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Experience Level</Typography>
            <FormControl fullWidth>
              <InputLabel>Experience</InputLabel>
              <Select
                value={preferences.experience || ''}
                onChange={(e) => handleFieldChange('experience', e.target.value)}
                label="Experience"
              >
                <MenuItem value="Entry Level">Entry Level</MenuItem>
                <MenuItem value="Mid Level">Mid Level</MenuItem>
                <MenuItem value="Senior Level">Senior Level</MenuItem>
                <MenuItem value="Lead/Principal">Lead/Principal</MenuItem>
                <MenuItem value="Executive">Executive</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Education</Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Education Level</InputLabel>
              <Select
                value={preferences.education || ''}
                onChange={(e) => handleFieldChange('education', e.target.value)}
                label="Education Level"
              >
                <MenuItem value="High School">High School</MenuItem>
                <MenuItem value="Associates">Associates</MenuItem>
                <MenuItem value="Bachelors">Bachelors</MenuItem>
                <MenuItem value="Masters">Masters</MenuItem>
                <MenuItem value="Doctorate">Doctorate</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      {/* Generate from CV Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Preferences from CV</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a parsed CV to automatically generate job preferences based on your experience and skills.
          </Typography>
          
          {cvs.length === 0 ? (
            <Alert severity="info">
              No parsed CVs available. Upload and parse a CV first.
            </Alert>
          ) : (
            <List>
              {cvs.map((cv) => (
                <React.Fragment key={cv.id}>
                  <ListItemButton onClick={() => handleGenerateFromCV(cv.id)}>
                    <ListItemText
                      primary={cv.title}
                      secondary={`${cv.skills?.length || 0} skills extracted`}
                    />
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PreferencesPage;