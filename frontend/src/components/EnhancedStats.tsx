import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { Work, TrendingUp, Schedule, SmartToy, Psychology, Speed } from '@mui/icons-material';

const EnhancedStats: React.FC = () => {
  const stats = [
    {
      icon: <Work sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Total Applications',
      value: 247,
      change: '+23 this week',
      progress: 85,
      color: 'primary'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Response Rate',
      value: '63%',
      change: '+12% vs industry',
      progress: 63,
      color: 'success'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Interviews',
      value: 8,
      change: '3 this week',
      progress: 75,
      color: 'warning'
    },
    {
      icon: <SmartToy sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'AI Optimization',
      value: '87%',
      change: 'Excellent score',
      progress: 87,
      color: 'info'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Match Quality',
      value: '92%',
      change: 'AI-powered matching',
      progress: 92,
      color: 'secondary'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Avg Response Time',
      value: '2.3 days',
      change: '40% faster',
      progress: 78,
      color: 'error'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ textAlign: 'center', pb: 3 }}>
              <Box sx={{ mb: 2 }}>{stat.icon}</Box>
              <Typography variant="h4" color={`${stat.color}.main`} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ minHeight: 48 }}>
                {stat.title}
              </Typography>
              <Chip 
                label={stat.change} 
                size="small" 
                color={stat.color as any}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <LinearProgress 
                variant="determinate" 
                value={stat.progress} 
                color={stat.color as any}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EnhancedStats;