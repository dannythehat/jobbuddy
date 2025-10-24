import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { Work, Schedule, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RobotAvatar from '../components/RobotAvatar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Essential stats only
  const stats = {
    applications: 24,
    interviews: 3,
    responses: 12
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Simple welcome */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <RobotAvatar size={60} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4">Welcome back, {user?.name}!</Typography>
          <Typography color="text.secondary">Here's what needs your attention</Typography>
        </Box>
      </Box>

      {/* Essential stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Work sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" color="primary">{stats.applications}</Typography>
              <Typography variant="h6">Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h3" color="warning.main">{stats.interviews}</Typography>
              <Typography variant="h6">Interviews</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h3" color="success.main">{stats.responses}</Typography>
              <Typography variant="h6">Responses</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button component={RouterLink} to="/applications" variant="contained" fullWidth>
                  View Applications
                </Button>
                <Button component={RouterLink} to="/interviews" variant="outlined" fullWidth>
                  Manage Interviews
                </Button>
                <Button component={RouterLink} to="/jobs" variant="outlined" fullWidth>
                  Find Jobs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Applied to Software Engineer at TechCorp
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Interview scheduled with DataFlow
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Response received from WebCorp
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;