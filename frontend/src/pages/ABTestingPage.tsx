import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Science as ScienceIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ABTest {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  variants: Array<{
    id: string;
    name: string;
    content: any;
    weight: number;
  }>;
  targetMetric: string;
  minimumSampleSize: number;
  confidenceLevel: number;
  expectedEffect: number;
  startDate?: string;
  endDate?: string;
  duration?: number;
  results?: {
    winner?: string;
    confidence: number;
    statisticalSignificance: boolean;
    pValue: number;
    effectSize: number;
    variants: Array<{
      id: string;
      name: string;
      participants: number;
      conversions: number;
      conversionRate: number;
      confidenceInterval: { lower: number; upper: number };
    }>;
    recommendations: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface TestTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  variants: any[];
  targetMetric: string;
  minimumSampleSize: number;
  expectedEffect: number;
}

const ABTestingPage: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating new test
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    type: 'cover_letter',
    targetMetric: 'response_rate',
    minimumSampleSize: 50,
    confidenceLevel: 95,
    expectedEffect: 15,
    duration: 30,
    variants: [
      { name: 'Control', content: {}, weight: 50 },
      { name: 'Variant A', content: {}, weight: 50 }
    ]
  });

  useEffect(() => {
    fetchTests();
    fetchTemplates();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ab-tests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tests');
      }

      const result = await response.json();
      setTests(result.data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ab-tests/templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const result = await response.json();
      setTemplates(result.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const createTest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTest)
      });

      if (!response.ok) {
        throw new Error('Failed to create test');
      }

      setCreateDialogOpen(false);
      fetchTests();
      
      // Reset form
      setNewTest({
        name: '',
        description: '',
        type: 'cover_letter',
        targetMetric: 'response_rate',
        minimumSampleSize: 50,
        confidenceLevel: 95,
        expectedEffect: 15,
        duration: 30,
        variants: [
          { name: 'Control', content: {}, weight: 50 },
          { name: 'Variant A', content: {}, weight: 50 }
        ]
      });
    } catch (error) {
      console.error('Error creating test:', error);
      setError(error instanceof Error ? error.message : 'Failed to create test');
    }
  };

  const startTest = async (testId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ab-tests/${testId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to start test');
      }

      fetchTests();
    } catch (error) {
      console.error('Error starting test:', error);
      setError(error instanceof Error ? error.message : 'Failed to start test');
    }
  };

  const pauseTest = async (testId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ab-tests/${testId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to pause test');
      }

      fetchTests();
    } catch (error) {
      console.error('Error pausing test:', error);
      setError(error instanceof Error ? error.message : 'Failed to pause test');
    }
  };

  const completeTest = async (testId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ab-tests/${testId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete test');
      }

      fetchTests();
    } catch (error) {
      console.error('Error completing test:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete test');
    }
  };

  const viewResults = async (test: ABTest) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ab-tests/${test.id}/results`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const result = await response.json();
      setSelectedTest({ ...test, results: result.data });
      setResultsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch results');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <PlayIcon />;
      case 'paused': return <PauseIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'draft': return <AssignmentIcon />;
      default: return <InfoIcon />;
    }
  };

  const addVariant = () => {
    const newVariants = [...newTest.variants, { name: `Variant ${String.fromCharCode(65 + newTest.variants.length - 1)}`, content: {}, weight: 0 }];
    const equalWeight = Math.floor(100 / newVariants.length);
    const adjustedVariants = newVariants.map((variant, index) => ({
      ...variant,
      weight: index === newVariants.length - 1 ? 100 - (equalWeight * (newVariants.length - 1)) : equalWeight
    }));
    setNewTest({ ...newTest, variants: adjustedVariants });
  };

  const removeVariant = (index: number) => {
    if (newTest.variants.length <= 2) return;
    const newVariants = newTest.variants.filter((_, i) => i !== index);
    const equalWeight = Math.floor(100 / newVariants.length);
    const adjustedVariants = newVariants.map((variant, i) => ({
      ...variant,
      weight: i === newVariants.length - 1 ? 100 - (equalWeight * (newVariants.length - 1)) : equalWeight
    }));
    setNewTest({ ...newTest, variants: adjustedVariants });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            A/B Testing Lab
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Optimize your job applications through data-driven experimentation
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          Create Test
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Tests</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {tests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All experiments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlayIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Running</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {tests.filter(t => t.status === 'running').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active experiments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {tests.filter(t => t.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Finished experiments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Winners</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {tests.filter(t => t.results?.winner).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Significant results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Tests" />
          <Tab label="Running Tests" />
          <Tab label="Results" />
          <Tab label="Templates" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {tests.map((test) => (
            <Grid item xs={12} md={6} lg={4} key={test.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {test.name}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(test.status)}
                      label={test.status.toUpperCase()}
                      color={getStatusColor(test.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {test.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Type: {test.type.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Target: {test.targetMetric.replace('_', ' ')}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Variants: {test.variants.length}
                    </Typography>
                  </Box>

                  {test.results && (
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={test.results.confidence}
                        sx={{ mb: 1 }}
                        color={test.results.statisticalSignificance ? 'success' : 'warning'}
                      />
                      <Typography variant="caption">
                        Confidence: {test.results.confidence.toFixed(1)}%
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {test.status === 'draft' && (
                      <Button
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => startTest(test.id)}
                        color="success"
                      >
                        Start
                      </Button>
                    )}
                    
                    {test.status === 'running' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<PauseIcon />}
                          onClick={() => pauseTest(test.id)}
                          color="warning"
                        >
                          Pause
                        </Button>
                        <Button
                          size="small"
                          startIcon={<StopIcon />}
                          onClick={() => completeTest(test.id)}
                          color="error"
                        >
                          Stop
                        </Button>
                      </>
                    )}
                    
                    {test.status === 'paused' && (
                      <Button
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => startTest(test.id)}
                        color="success"
                      >
                        Resume
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      startIcon={<AnalyticsIcon />}
                      onClick={() => viewResults(test)}
                    >
                      Results
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {tests.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ScienceIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No A/B Tests Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first experiment to start optimizing your job applications
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Your First Test
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {tests.filter(t => t.status === 'running').map((test) => (
            <Grid item xs={12} key={test.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{test.name}</Typography>
                    <Chip label="RUNNING" color="success" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {test.description}
                  </Typography>
                  
                  {test.results && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Results:
                      </Typography>
                      <Grid container spacing={2}>
                        {test.results.variants.map((variant) => (
                          <Grid item xs={12} sm={6} md={3} key={variant.id}>
                            <Paper sx={{ p: 2 }}>
                              <Typography variant="subtitle2">{variant.name}</Typography>
                              <Typography variant="h6" color="primary">
                                {variant.conversionRate.toFixed(1)}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {variant.participants} participants
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<PauseIcon />}
                      onClick={() => pauseTest(test.id)}
                      color="warning"
                    >
                      Pause
                    </Button>
                    <Button
                      startIcon={<StopIcon />}
                      onClick={() => completeTest(test.id)}
                      color="error"
                    >
                      Complete
                    </Button>
                    <Button
                      startIcon={<AnalyticsIcon />}
                      onClick={() => viewResults(test)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {tests.filter(t => t.status === 'completed' && t.results).map((test) => (
            <Grid item xs={12} key={test.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{test.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="COMPLETED" 
                        color="info" 
                      />
                      {test.results?.statisticalSignificance && (
                        <Chip 
                          label="SIGNIFICANT" 
                          color="success" 
                        />
                      )}
                    </Box>
                  </Box>
                  
                  {test.results && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={test.results.variants}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Test Results:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Confidence"
                              secondary={`${test.results.confidence.toFixed(1)}%`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="P-Value"
                              secondary={test.results.pValue.toFixed(4)}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Effect Size"
                              secondary={`${test.results.effectSize.toFixed(1)}%`}
                            />
                          </ListItem>
                          {test.results.winner && (
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Winner"
                                secondary={test.results.variants.find(v => v.id === test.results?.winner)?.name}
                              />
                            </ListItem>
                          )}
                        </List>
                      </Grid>
                    </Grid>
                  )}
                  
                  <Button
                    startIcon={<ViewIcon />}
                    onClick={() => viewResults(test)}
                    sx={{ mt: 2 }}
                  >
                    View Full Results
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} key={template.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip label={template.type.replace('_', ' ')} size="small" sx={{ mr: 1 }} />
                    <Chip label={`${template.variants.length} variants`} size="small" sx={{ mr: 1 }} />
                    <Chip label={`${template.expectedEffect}% expected lift`} size="small" />
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setNewTest({
                        ...newTest,
                        name: template.name,
                        description: template.description,
                        type: template.type,
                        targetMetric: template.targetMetric,
                        minimumSampleSize: template.minimumSampleSize,
                        expectedEffect: template.expectedEffect,
                        variants: template.variants
                      });
                      setCreateDialogOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Test Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New A/B Test</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Test Name"
                  value={newTest.name}
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Test Type</InputLabel>
                  <Select
                    value={newTest.type}
                    label="Test Type"
                    onChange={(e) => setNewTest({ ...newTest, type: e.target.value })}
                  >
                    <MenuItem value="cover_letter">Cover Letter</MenuItem>
                    <MenuItem value="application_method">Application Method</MenuItem>
                    <MenuItem value="timing">Timing</MenuItem>
                    <MenuItem value="cv_template">CV Template</MenuItem>
                    <MenuItem value="subject_line">Subject Line</MenuItem>
                    <MenuItem value="follow_up">Follow-up</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Metric</InputLabel>
                  <Select
                    value={newTest.targetMetric}
                    label="Target Metric"
                    onChange={(e) => setNewTest({ ...newTest, targetMetric: e.target.value })}
                  >
                    <MenuItem value="response_rate">Response Rate</MenuItem>
                    <MenuItem value="interview_rate">Interview Rate</MenuItem>
                    <MenuItem value="offer_rate">Offer Rate</MenuItem>
                    <MenuItem value="click_rate">Click Rate</MenuItem>
                    <MenuItem value="open_rate">Open Rate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Sample Size"
                  value={newTest.minimumSampleSize}
                  onChange={(e) => setNewTest({ ...newTest, minimumSampleSize: parseInt(e.target.value) })}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Confidence Level</InputLabel>
                  <Select
                    value={newTest.confidenceLevel}
                    label="Confidence Level"
                    onChange={(e) => setNewTest({ ...newTest, confidenceLevel: e.target.value as number })}
                  >
                    <MenuItem value={90}>90%</MenuItem>
                    <MenuItem value={95}>95%</MenuItem>
                    <MenuItem value={99}>99%</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Expected Effect (%)"
                  value={newTest.expectedEffect}
                  onChange={(e) => setNewTest({ ...newTest, expectedEffect: parseFloat(e.target.value) })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Variants
                </Typography>
                {newTest.variants.map((variant, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Variant Name"
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = [...newTest.variants];
                            newVariants[index].name = e.target.value;
                            setNewTest({ ...newTest, variants: newVariants });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Weight (%)"
                          value={variant.weight}
                          onChange={(e) => {
                            const newVariants = [...newTest.variants];
                            newVariants[index].weight = parseFloat(e.target.value);
                            setNewTest({ ...newTest, variants: newVariants });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Content (JSON)"
                          value={JSON.stringify(variant.content)}
                          onChange={(e) => {
                            try {
                              const newVariants = [...newTest.variants];
                              newVariants[index].content = JSON.parse(e.target.value);
                              setNewTest({ ...newTest, variants: newVariants });
                            } catch (error) {
                              // Invalid JSON, ignore
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        {newTest.variants.length > 2 && (
                          <IconButton onClick={() => removeVariant(index)} color="error">
                            <StopIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addVariant}>
                  Add Variant
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={createTest} variant="contained">Create Test</Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={resultsDialogOpen} onClose={() => setResultsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Test Results: {selectedTest?.name}
        </DialogTitle>
        <DialogContent>
          {selectedTest?.results && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Conversion Rates by Variant
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={selectedTest.results.variants}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Statistical Summary
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Statistical Significance"
                        secondary={selectedTest.results.statisticalSignificance ? 'Yes' : 'No'}
                      />
                      <ListItemIcon>
                        {selectedTest.results.statisticalSignificance ? 
                          <CheckCircleIcon color="success" /> : 
                          <WarningIcon color="warning" />
                        }
                      </ListItemIcon>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Confidence"
                        secondary={`${selectedTest.results.confidence.toFixed(1)}%`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="P-Value"
                        secondary={selectedTest.results.pValue.toFixed(4)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Effect Size"
                        secondary={`${selectedTest.results.effectSize.toFixed(1)}%`}
                      />
                    </ListItem>
                  </List>
                  
                  {selectedTest.results.winner && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <AlertTitle>Winner Detected!</AlertTitle>
                      {selectedTest.results.variants.find(v => v.id === selectedTest.results?.winner)?.name} 
                      shows statistically significant improvement.
                    </Alert>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Detailed Results
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Variant</TableCell>
                          <TableCell align="right">Participants</TableCell>
                          <TableCell align="right">Conversions</TableCell>
                          <TableCell align="right">Conversion Rate</TableCell>
                          <TableCell align="right">Confidence Interval</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedTest.results.variants.map((variant) => (
                          <TableRow key={variant.id}>
                            <TableCell>
                              {variant.name}
                              {selectedTest.results?.winner === variant.id && (
                                <Chip label="Winner" color="success" size="small" sx={{ ml: 1 }} />
                              )}
                            </TableCell>
                            <TableCell align="right">{variant.participants}</TableCell>
                            <TableCell align="right">{variant.conversions}</TableCell>
                            <TableCell align="right">{variant.conversionRate.toFixed(2)}%</TableCell>
                            <TableCell align="right">
                              {variant.confidenceInterval.lower.toFixed(1)}% - {variant.confidenceInterval.upper.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                {selectedTest.results.recommendations.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    <List>
                      {selectedTest.results.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PsychologyIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ABTestingPage;