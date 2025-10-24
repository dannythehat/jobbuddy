import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Chip, LinearProgress } from '@mui/material';
import { Work, TrendingUp, Schedule, SmartToy } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import RobotAvatar from '../components/RobotAvatar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { icon: <Work color="primary" />, title: 'Applications', value: 24, desc: 'Total submitted', color: 'primary' },
    { icon: <TrendingUp color="success" />, title: 'Active', value: 8, desc: 'Pending responses', color: 'success' },
    { icon: <Schedule color="warning" />, title: 'Interviews', value: 3, desc: 'Scheduled', color: 'warning' },
    { icon: <SmartToy color="info" />, title: 'Response Rate', value: '50%', desc: 'AI optimized', color: 'info' },
  ];

  const activities = [
    { type: 'interview', msg: 'AI scheduled interview with TechCorp', time: '2h ago', color: 'warning' },
    { type: 'response', msg: 'Response classified: Interview invite', time: '1d ago', color: 'success' },
    { type: 'application', msg: 'Auto-applied to Frontend role', time: '2d ago', color: 'primary' },
    { type: 'ai', msg: 'CV parsed and skills updated', time: '3d ago', color: 'info' },
  ];

  const getIcon = (type: string) => {
    const icons = { interview: <Schedule />, response: <TrendingUp />, application: <Work />, ai: <SmartToy /> };
    return icons[type as keyof typeof icons] || <Work />;
  };

  return (
    <Container maxWidth="lg">
      {/* Header with Robot */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <RobotAvatar size={60} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4" gutterBottom>Welcome back, {user?.name}! 🤖</Typography>
          <Typography color="text.secondary">Your AI buddy has been working hard!</Typography>
        </Box>
      </Box>

      {/* Phase 4.2 Status */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip label="🚀 Phase 4.2: Complete Interview Automation Active" color="primary" 
          sx={{ fontSize: '1rem', py: 2, px: 3, fontWeight: 'bold' }} />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h4" color={`${stat.color}.main`}>{stat.value}</Typography>
                <Typography variant="h6" gutterBottom>{stat.title}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* AI Activity Feed */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>🤖 AI Activity Feed</Typography>
              {activities.map((activity, i) => (
                <Box key={i} sx={{ 
                  display: 'flex', alignItems: 'center', py: 2, 
                  borderBottom: i < activities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider' 
                }}>
                  <Box sx={{ mr: 2 }}>{getIcon(activity.type)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">{activity.msg}</Typography>
                    <Typography variant="body2" color="text.secondary">{activity.time}</Typography>
                  </Box>
                  <Chip label={activity.type} color={activity.color as any} size="small" variant="outlined" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Progress */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>🎯 AI Progress</Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>Application Success</Typography>
                <LinearProgress variant="determinate" value={75} sx={{ mb: 1, height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">AI optimization: 75% effective</Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>Interview Automation</Typography>
                <LinearProgress variant="determinate" value={100} color="success" sx={{ mb: 1, height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">Phase 4.2: 100% automated</Typography>
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Weekly Goal</Typography>
                <LinearProgress variant="determinate" value={60} color="warning" sx={{ mb: 1, height: 8, borderRadius: 4 }} />
                <Typography variant="caption" color="text.secondary">6 of 10 applications this week</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;