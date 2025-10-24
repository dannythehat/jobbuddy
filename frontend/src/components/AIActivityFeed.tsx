import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { Schedule, Email, Work, Psychology, CheckCircle, AutoAwesome } from '@mui/icons-material';

const AIActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'interview_scheduled',
      icon: <Schedule />,
      title: 'Interview Auto-Scheduled',
      description: 'AI detected interview invitation and scheduled with TechCorp',
      time: '15 minutes ago',
      status: 'success',
      details: 'Senior Developer • Oct 25, 2:00 PM'
    },
    {
      id: 2,
      type: 'response_classified',
      icon: <Email />,
      title: 'Response Classified',
      description: 'Email from DataFlow classified as "Interview Invitation" (95% confidence)',
      time: '1 hour ago',
      status: 'info',
      details: 'Full Stack Engineer • Confidence: 95%'
    },
    {
      id: 3,
      type: 'application_generated',
      icon: <Work />,
      title: 'Application Generated',
      description: 'AI created personalized cover letter with professional tone',
      time: '3 hours ago',
      status: 'success',
      details: 'Frontend Developer • WebCorp • 3 variations'
    },
    {
      id: 4,
      type: 'skills_updated',
      icon: <Psychology />,
      title: 'Skills Profile Updated',
      description: 'Extracted 15 new skills from Machine Learning certificate',
      time: '6 hours ago',
      status: 'info',
      details: 'ML, TensorFlow, PyTorch, Neural Networks...'
    },
    {
      id: 5,
      type: 'optimization',
      icon: <AutoAwesome />,
      title: 'Profile Optimized',
      description: 'AI improved job matching score by 12% with keyword optimization',
      time: '1 day ago',
      status: 'success',
      details: 'Match score: 87% → 92%'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = { success: 'success', info: 'info', warning: 'warning', error: 'error' };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getIconColor = (type: string) => {
    const colors = {
      interview_scheduled: 'warning.main',
      response_classified: 'info.main',
      application_generated: 'primary.main',
      skills_updated: 'secondary.main',
      optimization: 'success.main'
    };
    return colors[type as keyof typeof colors] || 'grey.500';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <Psychology />
          </Avatar>
          <Typography variant="h5">🤖 AI Activity Feed</Typography>
        </Box>
        
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getIconColor(activity.type), width: 40, height: 40 }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {activity.title}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={activity.status} 
                        color={getStatusColor(activity.status) as any}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {activity.details}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AIActivityFeed;