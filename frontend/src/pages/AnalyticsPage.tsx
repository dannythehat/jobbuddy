import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
  Lightbulb as LightbulbIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Target as TargetIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface AnalyticsData {
  overview: {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    acceptanceRate: number;
    averageResponseTime: number;
    activeApplications: number;
    thisMonthApplications: number;
    successScore: number;
  };
  trends: {
    applicationTrends: Array<{ date: string; count: number; responses: number; interviews: number }>;
    responseRateTrend: Array<{ date: string; rate: number }>;
    methodEffectiveness: Array<{ method: string; applications: number; responseRate: number; successRate: number }>;
    industryPerformance: Array<{ industry: string; applications: number; successRate: number }>;
    salaryTrends: Array<{ range: string; applications: number; successRate: number; avgOffer: number }>;
  };
  performance: {
    bestPerformingMethods: Array<{ method: string; successRate: number; sampleSize: number }>;
    timeToResponse: { average: number; median: number; fastest: number; slowest: number };
    interviewConversionRate: number;
    offerConversionRate: number;
    skillsEffectiveness: Array<{ skill: string; demandScore: number; successRate: number }>;
    coverLetterPerformance: { aiGenerated: number; custom: number; template: number };
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    data?: any;
  }>;
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    expectedImpact: string;
    actionSteps: string[];
    confidence: number;
  }>;
  goals: {
    currentGoals: Array<{
      id: string;
      type: string;
      target: number;
      current: number;
      progress: number;
      deadline: Date;
      status: string;
    }>;
    suggestedGoals: Array<{
      type: string;
      target: number;
      reasoning: string;
      difficulty: string;
    }>;
  };
  predictions: {
    nextWeekApplications: number;
    expectedResponses: number;
    likelyInterviews: number;
    successProbability: number;
    timeToNextOffer: number;
    confidenceInterval: { min: number; max: number };
  };
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = await response.json();
      setAnalytics(result.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics/export?timeRange=${timeRange}&format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `jobbuddy-analytics-${timeRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          <AlertTitle>Error Loading Analytics</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!analytics) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mt: 4 }}>
          <AlertTitle>No Data Available</AlertTitle>
          No analytics data available for the selected time range.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into your job search performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1month">1 Month</MenuItem>
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
              <MenuItem value="1year">1 Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('json')}
          >
            Export JSON
          </Button>
        </Box>
      </Box>

      {/* Success Score Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Overall Success Score
              </Typography>
              <Typography variant="h2" component="div">
                {analytics.overview.successScore}/100
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Based on response rate, interview rate, and offer rate
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 60, opacity: 0.8 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {analytics.predictions.successProbability}% success probability
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Applications</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.overview.totalApplications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.overview.thisMonthApplications} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Response Rate</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {analytics.overview.responseRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Industry avg: 25-30%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Interview Rate</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {analytics.overview.interviewRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.performance.interviewConversionRate}% conversion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TargetIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Offer Rate</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {analytics.overview.offerRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.performance.offerConversionRate}% from interviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Different Views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Trends" />
          <Tab label="Performance" />
          <Tab label="Insights" />
          <Tab label="Predictions" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Application Trends Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.trends.applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="count" stackId="1" stroke="#8884d8" fill="#8884d8" name="Applications" />
                    <Area type="monotone" dataKey="responses" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Responses" />
                    <Area type="monotone" dataKey="interviews" stackId="3" stroke="#ffc658" fill="#ffc658" name="Interviews" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Method Effectiveness */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Method Effectiveness
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.trends.methodEffectiveness}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="#8884d8" name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Industry Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Industry Performance
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Industry</TableCell>
                        <TableCell align="right">Applications</TableCell>
                        <TableCell align="right">Success Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analytics.trends.industryPerformance.map((industry) => (
                        <TableRow key={industry.industry}>
                          <TableCell>{industry.industry}</TableCell>
                          <TableCell align="right">{industry.applications}</TableCell>
                          <TableCell align="right">{industry.successRate.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Salary Trends */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Salary Range Performance
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.trends.salaryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="#82ca9d" name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Response Time Analysis
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Average Response Time</Typography>
                  <Typography variant="h4">{analytics.performance.timeToResponse.average.toFixed(1)} days</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Fastest</Typography>
                    <Typography variant="h6">{analytics.performance.timeToResponse.fastest.toFixed(1)} days</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Slowest</Typography>
                    <Typography variant="h6">{analytics.performance.timeToResponse.slowest.toFixed(1)} days</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Effectiveness */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skills Effectiveness
                </Typography>
                <List dense>
                  {analytics.performance.skillsEffectiveness.map((skill) => (
                    <ListItem key={skill.skill}>
                      <ListItemText
                        primary={skill.skill}
                        secondary={`Demand: ${skill.demandScore}% | Success: ${skill.successRate}%`}
                      />
                      <Box sx={{ width: 100 }}>
                        <LinearProgress
                          variant="determinate"
                          value={skill.successRate}
                          color={skill.successRate > 80 ? 'success' : skill.successRate > 60 ? 'warning' : 'error'}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Cover Letter Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cover Letter Performance
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'AI Generated', value: analytics.performance.coverLetterPerformance.aiGenerated },
                        { name: 'Custom', value: analytics.performance.coverLetterPerformance.custom },
                        { name: 'Template', value: analytics.performance.coverLetterPerformance.template }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[
                        { name: 'AI Generated', value: analytics.performance.coverLetterPerformance.aiGenerated },
                        { name: 'Custom', value: analytics.performance.coverLetterPerformance.custom },
                        { name: 'Template', value: analytics.performance.coverLetterPerformance.template }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Best Performing Methods */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Best Performing Methods
                </Typography>
                <List>
                  {analytics.performance.bestPerformingMethods.slice(0, 5).map((method, index) => (
                    <ListItem key={method.method}>
                      <ListItemIcon>
                        <Chip label={index + 1} color="primary" size="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={method.method}
                        secondary={`${method.successRate.toFixed(1)}% success rate (${method.sampleSize} applications)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Insights */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI-Generated Insights
                </Typography>
                <List>
                  {analytics.insights.map((insight, index) => (
                    <ListItem key={index} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <ListItemIcon>
                        {getInsightIcon(insight.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">{insight.title}</Typography>
                            <Chip label={insight.impact} size="small" color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'info'} />
                          </Box>
                        }
                        secondary={insight.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <List>
                  {analytics.recommendations.slice(0, 3).map((rec, index) => (
                    <ListItem key={index} sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <ListItemIcon>
                        <LightbulbIcon color={getPriorityColor(rec.priority) as any} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">{rec.title}</Typography>
                            <Chip label={rec.priority} size="small" color={getPriorityColor(rec.priority) as any} />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>{rec.description}</Typography>
                            <Typography variant="caption" color="success.main">
                              Expected Impact: {rec.expectedImpact}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Goals */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Goals & Progress
                </Typography>
                <Grid container spacing={3}>
                  {analytics.goals.currentGoals.map((goal) => (
                    <Grid item xs={12} md={6} key={goal.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1">{goal.type.replace('_', ' ').toUpperCase()}</Typography>
                          <Chip 
                            label={goal.status} 
                            size="small" 
                            color={goal.status === 'on_track' ? 'success' : goal.status === 'ahead' ? 'info' : 'warning'} 
                          />
                        </Box>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {goal.current} / {goal.target}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={goal.progress} 
                          sx={{ mb: 1 }}
                          color={goal.progress >= 80 ? 'success' : goal.progress >= 60 ? 'warning' : 'error'}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {goal.progress}% complete
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* Predictions */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Predictions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" color="primary">
                        {analytics.predictions.nextWeekApplications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expected applications next week
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {analytics.predictions.expectedResponses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expected responses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <TimelineIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        {analytics.predictions.likelyInterviews}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Likely interviews
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <TargetIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {analytics.predictions.timeToNextOffer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days to next offer
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Success Probability */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Success Probability
                </Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CircularProgress
                    variant="determinate"
                    value={analytics.predictions.successProbability}
                    size={120}
                    thickness={4}
                    sx={{
                      color: analytics.predictions.successProbability > 70 ? 'success.main' : 
                             analytics.predictions.successProbability > 40 ? 'warning.main' : 'error.main'
                    }}
                  />
                  <Typography variant="h4" sx={{ mt: 2 }}>
                    {analytics.predictions.successProbability}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {analytics.predictions.confidenceInterval.min}% - {analytics.predictions.confidenceInterval.max}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AnalyticsPage;