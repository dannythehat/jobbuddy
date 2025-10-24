import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Lightbulb, TrendingUp, Warning, CheckCircle } from '@mui/icons-material';

interface Insight {
  type: 'success' | 'warning' | 'info' | 'recommendation';
  title: string;
  description: string;
  impact?: string;
  action?: string;
}

interface InsightsPanelProps {
  insights: Insight[];
  title?: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  insights, 
  title = "AI Insights & Recommendations" 
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'recommendation':
        return <Lightbulb color="info" />;
      default:
        return <TrendingUp color="primary" />;
    }
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'recommendation':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🤖 {title}
        </Typography>
        <List>
          {insights.map((insight, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                {getIcon(insight.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2">
                      {insight.title}
                    </Typography>
                    <Chip
                      label={insight.type}
                      size="small"
                      color={getChipColor(insight.type) as any}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {insight.description}
                    </Typography>
                    {insight.impact && (
                      <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        Impact: {insight.impact}
                      </Typography>
                    )}
                    {insight.action && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Action: {insight.action}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;