import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  getIcon: (type: string) => React.ReactNode;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, getIcon }) => (
  <Box>
    {activities.map((activity, i) => (
      <Box key={i} sx={{ 
        display: 'flex', alignItems: 'center', py: 2, 
        borderBottom: i < activities.length - 1 ? '1px solid' : 'none',
        borderColor: 'divider' 
      }}>
        <Box sx={{ mr: 2 }}>{getIcon(activity.type)}</Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">{activity.message}</Typography>
          <Typography variant="body2" color="text.secondary">{activity.time}</Typography>
        </Box>
        <Chip label={activity.type} color={activity.color as any} size="small" variant="outlined" />
      </Box>
    ))}
  </Box>
);

export default ActivityFeed;