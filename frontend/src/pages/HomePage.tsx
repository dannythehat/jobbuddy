import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Work, AutoAwesome, TrendingUp } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LandingHero from '../components/LandingHero';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: <Work sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Interview Automation', 
      description: 'AI detects invitations, schedules calendar events, generates responses.' },
    { icon: <AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Response Monitoring', 
      description: 'Auto-classify responses, extract data, update status in real-time.' },
    { icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'AI Applications', 
      description: 'Generate personalized cover letters and tailored resumes.' },
  ];

  const steps = [
    { label: '1', title: 'Upload CV', desc: 'AI extracts skills and experience automatically.' },
    { label: '2', title: 'Set Preferences', desc: 'Define job preferences and requirements.' },
    { label: '3', title: 'Auto Apply', desc: 'System finds jobs and submits applications.' },
    { label: '4', title: 'Track Progress', desc: 'Monitor applications, responses, interviews.' },
  ];

  return (
    <Container maxWidth="lg">
      {!isAuthenticated ? <LandingHero /> : (
        <Box sx={{ textAlign: 'center', py: 4, mb: 4 }}>
          <Typography variant="h3" gutterBottom>Welcome back! 🤖</Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
            Go to Dashboard
          </Button>
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Chip label="🎉 Phase 4.2 Complete - Interview Automation Live!" color="primary" 
          sx={{ fontSize: '1.1rem', py: 3, px: 2, fontWeight: 'bold' }} />
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>Latest Features</Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Complete automation from CV parsing to interview scheduling.
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>How It Works</Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {steps.map((step, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box>
                <Chip label={step.label} color="primary" sx={{ mb: 2, width: 40, height: 40 }} />
                <Typography variant="h6" gutterBottom>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {!isAuthenticated && (
        <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'primary.light', color: 'white', borderRadius: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>Ready to Automate Your Job Search?</Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join the future of job searching with AI-powered automation.
          </Typography>
          <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ 
            bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, px: 4, py: 1.5 
          }}>
            Start Your Free Trial 🚀
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;