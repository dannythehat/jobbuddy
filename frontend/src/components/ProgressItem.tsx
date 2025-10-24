import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ProgressItemProps {
  title: string;
  value: number;
  description: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
}

const ProgressItem: React.FC<ProgressItemProps> = ({ title, value, description, color = 'primary' }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body2" gutterBottom>{title}</Typography>
    <LinearProgress variant="determinate" value={value} color={color} 
      sx={{ mb: 1, height: 8, borderRadius: 4 }} />
    <Typography variant="caption" color="text.secondary">{description}</Typography>
  </Box>
);

export default ProgressItem;