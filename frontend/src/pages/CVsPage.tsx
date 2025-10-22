import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  Edit,
  MoreVert,
  CheckCircle,
  Error,
  Refresh,
} from '@mui/icons-material';

interface CV {
  id: string;
  title: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  parsedData?: any;
  skills?: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const CVsPage: React.FC = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvTitle, setCvTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cvs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCvs(data.data);
      } else {
        setError('Failed to fetch CVs');
      }
    } catch (err) {
      setError('Error fetching CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate title from filename
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setCvTitle(nameWithoutExtension);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !cvTitle.trim()) {
      setError('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);
      formData.append('title', cvTitle.trim());

      const token = localStorage.getItem('token');
      const response = await fetch('/api/cvs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('CV uploaded successfully! Parsing in progress...');
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setCvTitle('');
        fetchCVs(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload CV');
      }
    } catch (err) {
      setError('Error uploading CV');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('CV deleted successfully');
        fetchCVs();
      } else {
        setError('Failed to delete CV');
      }
    } catch (err) {
      setError('Error deleting CV');
    }
  };

  const handleSetDefault = async (cvId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        setSuccess('Default CV updated');
        fetchCVs();
      } else {
        setError('Failed to update default CV');
      }
    } catch (err) {
      setError('Error updating CV');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getParsingStatus = (cv: CV) => {
    if (!cv.parsedData) {
      return { status: 'parsing', color: 'warning', text: 'Parsing...' };
    }
    if ((cv.parsedData as any).error) {
      return { status: 'error', color: 'error', text: 'Parse Error' };
    }
    return { status: 'success', color: 'success', text: 'Parsed' };
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, cvId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCvId(cvId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCvId(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading CVs...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My CVs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload and manage your CVs for automated job applications.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{ mb: 3 }}
        >
          Upload New CV
        </Button>
      </Box>

      {cvs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No CVs uploaded yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first CV to get started with automated job applications.
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Your First CV
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {cvs.map((cv) => {
            const parsingStatus = getParsingStatus(cv);
            return (
              <Grid item xs={12} md={6} lg={4} key={cv.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                        {cv.title}
                        {cv.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, cv.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formatFileSize(cv.fileSize)} • {cv.fileType.split('/')[1].toUpperCase()}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={parsingStatus.text}
                        color={parsingStatus.color as any}
                        size="small"
                        icon={
                          parsingStatus.status === 'success' ? <CheckCircle /> :
                          parsingStatus.status === 'error' ? <Error /> : <Refresh />
                        }
                      />
                    </Box>

                    {cv.skills && cv.skills.length > 0 && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                          Skills ({cv.skills.length}):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {cv.skills.slice(0, 6).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {cv.skills.length > 6 && (
                            <Chip
                              label={`+${cv.skills.length - 6} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                      Uploaded {new Date(cv.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedCvId) handleSetDefault(selectedCvId);
          handleMenuClose();
        }}>
          Set as Default
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedCvId) handleDeleteCV(selectedCvId);
          handleMenuClose();
        }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New CV</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="CV Title"
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="e.g., Software Developer CV 2024"
            />

            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="cv-file-input"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="cv-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Choose File
              </Button>
            </label>

            {selectedFile && (
              <Alert severity="info">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || !cvTitle.trim() || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Parse'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CVsPage;