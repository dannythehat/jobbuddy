import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Work as WorkIcon,
  Description as CVIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import IntegrationSetup from '../components/IntegrationSetup';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data from API
  const stats = {
    totalApplications: 24,
    activeApplications: 8,
    interviews: 3,
    responses: 12,
  };

  const recentActivity = [
    { id: 1, type: 'application', message: 'Applied to Software Engineer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'response', message: 'Received response from DataFlow Inc.', time: '1 day ago' },
    { id: 3, type: 'interview', message: 'Interview scheduled with StartupXYZ', time: '2 days ago' },
    { id: 4, type: 'application', message: 'Applied to Frontend Developer at WebCo', time: '3 days ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <WorkIcon color="primary" />;
      case 'response':
        return <TrendingUpIcon color="success" />;
      case 'interview':
        return <ScheduleIcon color="warning" />;
      default:
        return <CVIcon color="info" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'primary';
      case 'response':
        return 'success';
      case 'interview':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your job search progress.
        </Typography>
      </Box>

      {/* Integration Setup Card */}
      <IntegrationSetup showOnlyIfIncomplete={true} />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Applications</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalApplications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.activeApplications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending responses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Interviews</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats.interviews}
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CVIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Response Rate</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {Math.round((stats.responses / stats.totalApplications) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall response rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <Box>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">
                        {activity.message}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={activity.type}
                      color={getActivityColor(activity.type) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Application Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.responses / stats.totalApplications) * 100}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stats.responses} of {stats.totalApplications} applications received responses
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" gutterBottom>
                    This Week's Goal
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={60}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    6 of 10 applications completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;