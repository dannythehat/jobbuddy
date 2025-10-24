import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../contexts/AuthContext';
import LandingHero from '../components/LandingHero';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Complete Interview Automation',
      description: 'AI detects interview invitations, schedules calendar events, and generates professional email responses.',
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Response Monitoring',
      description: 'Automatically classify job responses, extract key data, and update application status in real-time.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Applications',
      description: 'Generate personalized cover letters and tailored resumes with multiple tone variations.',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Enhanced Hero Section with Robot */}
      {!isAuthenticated ? (
        <LandingHero />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Welcome back! 🤖
          </Typography>
          <Button
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Go to Dashboard
          </Button>
        </Box>
      )}

      {/* Phase 4.2 Status */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Chip 
          label="🎉 Phase 4.2 Complete - Interview Automation Live!" 
          color="primary"
          sx={{ 
            fontSize: '1.1rem',
            py: 3,
            px: 2,
            fontWeight: 'bold'
          }} 
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Latest Features
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          JobBuddi now offers complete automation from CV parsing to interview scheduling.
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Chip label="1" color="primary" sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="h6" gutterBottom>Upload CV</Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your resume and let our AI extract your skills and experience.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Chip label="2" color="primary" sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="h6" gutterBottom>Set Preferences</Typography>
              <Typography variant="body2" color="text.secondary">
                Define your job preferences, salary expectations, and location requirements.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Chip label="3" color="primary" sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="h6" gutterBottom>Auto Apply</Typography>
              <Typography variant="body2" color="text.secondary">
                Our system finds matching jobs and submits personalized applications automatically.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Chip label="4" color="primary" sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="h6" gutterBottom>Track Progress</Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor applications, responses, and interviews with complete automation.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            bgcolor: 'primary.light',
            color: 'white',
            borderRadius: 4,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Automate Your Job Search?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join the future of job searching with AI-powered automation.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              px: 4, 
              py: 1.5 
            }}
          >
            Start Your Free Trial 🚀
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;