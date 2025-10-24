import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  progress?: number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  description,
  color = 'primary',
  progress,
  icon
}) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp color="success" fontSize="small" />;
    if (change < 0) return <TrendingDown color="error" fontSize="small" />;
    return <TrendingFlat color="warning" fontSize="small" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'default';
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'warning';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: `${color}.main` }}>{icon}</Box>}
        </Box>
        
        <Typography variant="h3" color={`${color}.main`} gutterBottom>
          {value}
        </Typography>
        
        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getTrendIcon()}
            <Chip
              label={`${change > 0 ? '+' : ''}${change}% ${changeLabel || 'vs last period'}`}
              color={getTrendColor() as any}
              size="small"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>
        )}
        
        {progress !== undefined && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {progress}% of target
            </Typography>
          </Box>
        )}
        
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;