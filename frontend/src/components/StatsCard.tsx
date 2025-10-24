import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, description, color = 'primary' }) => (
  <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
    <CardContent>
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography variant="h4" color={`${color}.main`} gutterBottom>{value}</Typography>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </CardContent>
  </Card>
);

export default StatsCard;