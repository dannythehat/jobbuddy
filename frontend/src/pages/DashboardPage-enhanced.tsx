import React from 'react';
import { Container, Typography, Grid, Box, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import RobotAvatar from '../components/RobotAvatar';
import EnhancedStats from '../components/EnhancedStats';
import AIActivityFeed from '../components/AIActivityFeed';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Enhanced Header with Robot */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #4A90E2 0%, #7ED321 100%)',
        borderRadius: 3,
        color: 'white'
      }}>
        <RobotAvatar size={80} />
        <Box sx={{ ml: 3, flexGrow: 1 }}>
          <Typography variant="h3" gutterBottom>
            Welcome back, {user?.name}! 🤖
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            Your AI assistant has been working hard on your job search
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label="🚀 Phase 4.2: Interview Automation Active" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
            <Chip 
              label="🎯 AI Optimization: 87% Score" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
            <Chip 
              label="⚡ 247 Applications Processed" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Enhanced Stats Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          📊 Your AI-Powered Job Search Analytics
        </Typography>
        <EnhancedStats />
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* AI Activity Feed */}
        <Grid item xs={12} lg={8}>
          <AIActivityFeed />
        </Grid>

        {/* Quick Insights Panel */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* AI Insights Card */}
            <Box sx={{ 
              p: 3, 
              bgcolor: 'success.light', 
              color: 'white', 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Typography variant="h5" gutterBottom>🎉 AI Success!</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your AI-optimized applications have a 23% higher response rate than industry average
              </Typography>
              <Chip label="Keep using AI optimization!" sx={{ bgcolor: 'white', color: 'success.main' }} />
            </Box>

            {/* Upcoming Interviews */}
            <Box sx={{ p: 3, bgcolor: 'warning.light', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>📅 Next Interview</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>TechCorp</strong> - Senior Developer
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Tomorrow at 2:00 PM (Auto-scheduled by AI)
              </Typography>
              <Chip label="AI Preparation Ready" sx={{ bgcolor: 'white', color: 'warning.main' }} />
            </Box>

            {/* Quick Actions */}
            <Box sx={{ p: 3, bgcolor: 'info.light', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>⚡ Quick Actions</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                • Upload new CV for AI analysis<br/>
                • Review 3 pending interview invites<br/>
                • Check 12 new AI recommendations<br/>
                • Update job preferences
              </Typography>
              <Chip label="Take Action" sx={{ bgcolor: 'white', color: 'info.main' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;