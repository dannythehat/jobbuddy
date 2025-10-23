import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  Work as WorkIcon
} from '@mui/icons-material';

interface ExistingApplication {
  id: string;
  status: string;
  submissionDate?: string;
  createdAt: string;
}

interface DuplicateApplicationDialogProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  jobTitle: string;
  company: string;
  existingApplication: ExistingApplication;
}

const DuplicateApplicationDialog: React.FC<DuplicateApplicationDialogProps> = ({
  open,
  onClose,
  onProceed,
  jobTitle,
  company,
  existingApplication
}) => {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      draft: 'default',
      submitted: 'primary',
      interviewing: 'info',
      offered: 'success',
      accepted: 'success',
      rejected: 'error',
      withdrawn: 'warning'
    };
    return colors[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Duplicate Application Detected
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have already applied to this job. Creating another application may appear unprofessional.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Job Details
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <WorkIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              <strong>{jobTitle}</strong> at {company}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Existing Application
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Chip
              label={existingApplication.status}
              color={getStatusColor(existingApplication.status)}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(existingApplication.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {existingApplication.submissionDate && (
            <Typography variant="body2" color="text.secondary">
              Submitted: {new Date(existingApplication.submissionDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Recommendation:</strong> Instead of creating a duplicate application, consider:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" color="text.secondary">
              Updating your existing application if it's still in draft
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Following up on your existing application
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Waiting for a response before reapplying
            </Typography>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onProceed} color="warning" variant="outlined">
          Create Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateApplicationDialog;