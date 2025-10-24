import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert 
} from '@mui/material';
import { 
  Dashboard, 
  TrendingUp, 
  Psychology, 
  Speed 
} from '@mui/icons-material';
import MetricCard from '../components/Analytics/MetricCard';
import AnalyticsChart from '../components/Analytics/AnalyticsChart';
import InsightsPanel from '../components/Analytics/InsightsPanel';
import { analyticsService, DashboardAnalytics } from '../services/analyticsService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const AnalyticsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardAnalytics();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Advanced Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive insights and performance metrics for your job search
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<Dashboard />} label="Overview" />
        <Tab icon={<TrendingUp />} label="Applications" />
        <Tab icon={<Psychology />} label="Skills" />
        <Tab icon={<Speed />} label="Performance" />
      </Tabs>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        {dashboardData && (
          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Applications"
                value={dashboardData.overview.totalApplications}
                change={15}
                changeLabel="this month"
                color="primary"
                progress={75}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Response Rate"
                value={`${dashboardData.overview.responseRate}%`}
                change={8}
                changeLabel="vs industry avg"
                color="success"
                description="Above industry average"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Interviews"
                value={dashboardData.overview.interviewsScheduled}
                change={25}
                changeLabel="this week"
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Time Saved"
                value={dashboardData.automation.timesSaved}
                description="Through AI automation"
                color="info"
              />
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Applications Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Application Analytics</Typography>
        <Typography variant="body2" color="text.secondary">
          Detailed breakdown of your application performance
        </Typography>
      </TabPanel>

      {/* Skills Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Skills Analysis</Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered skills assessment and recommendations
        </Typography>
      </TabPanel>

      {/* Performance Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
        <Typography variant="body2" color="text.secondary">
          Efficiency and success rate analysis
        </Typography>
      </TabPanel>
    </Container>
  );
};

export default AnalyticsPage;