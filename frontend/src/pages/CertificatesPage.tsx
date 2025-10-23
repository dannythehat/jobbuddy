import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Divider,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  School as SchoolIcon,
  EmojiEvents as AwardIcon,
  Assignment as CertificateIcon,
  Security as LicenseIcon,
  MenuBook as CourseIcon,
  Category as OtherIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  category: 'certificate' | 'award' | 'license' | 'qualification' | 'course' | 'other';
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  isVerified: boolean;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CertificateStats {
  categoryBreakdown: Array<{ category: string; count: number }>;
  totalCertificates: number;
  expiringCertificates: number;
  expiredCertificates: number;
  verifiedCertificates: number;
  verificationRate: number;
}

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    category: 'certificate' as Certificate['category'],
    skills: [] as string[],
    isVerified: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchCertificates();
    fetchStats();
  }, [selectedCategory, searchTerm]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/certificates?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data.certificates);
      } else {
        setError('Failed to fetch certificates');
      }
    } catch (err) {
      setError('Error fetching certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/certificates/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      if (selectedFile) {
        formDataToSend.append('certificate', selectedFile);
      }

      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        resetForm();
        fetchCertificates();
        fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create certificate');
      }
    } catch (err) {
      setError('Error creating certificate');
    }
  };

  const handleUpdateCertificate = async () => {
    if (!selectedCertificate) return;

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'skills') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      if (selectedFile) {
        formDataToSend.append('certificate', selectedFile);
      }

      const response = await fetch(`/api/certificates/${selectedCertificate.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setEditDialogOpen(false);
        resetForm();
        fetchCertificates();
        fetchStats();
      } else {
        setError('Failed to update certificate');
      }
    } catch (err) {
      setError('Error updating certificate');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCertificates();
        fetchStats();
      } else {
        setError('Failed to delete certificate');
      }
    } catch (err) {
      setError('Error deleting certificate');
    }
  };

  const handleDownloadCertificate = async (id: string, fileName?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'certificate';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download certificate');
      }
    } catch (err) {
      setError('Error downloading certificate');
    }
  };

  const handleVerifyCertificate = async (id: string, isVerified: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified })
      });

      if (response.ok) {
        fetchCertificates();
        fetchStats();
      } else {
        setError('Failed to verify certificate');
      }
    } catch (err) {
      setError('Error verifying certificate');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      description: '',
      category: 'certificate',
      skills: [],
      isVerified: false
    });
    setSelectedFile(null);
    setSkillInput('');
    setSelectedCertificate(null);
  };

  const openEditDialog = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate || '',
      credentialId: certificate.credentialId || '',
      credentialUrl: certificate.credentialUrl || '',
      description: certificate.description || '',
      category: certificate.category,
      skills: certificate.skills || [],
      isVerified: certificate.isVerified
    });
    setEditDialogOpen(true);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      certificate: <CertificateIcon />,
      award: <AwardIcon />,
      license: <LicenseIcon />,
      qualification: <SchoolIcon />,
      course: <CourseIcon />,
      other: <OtherIcon />
    };
    return icons[category as keyof typeof icons] || <OtherIcon />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      certificate: 'primary',
      award: 'warning',
      license: 'error',
      qualification: 'success',
      course: 'info',
      other: 'default'
    };
    return colors[category as keyof typeof colors] as any || 'default';
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow && expiry >= new Date();
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredCertificates = certificates.filter(cert => {
    if (tabValue === 1) return cert.isVerified;
    if (tabValue === 2) return isExpiringSoon(cert.expiryDate);
    if (tabValue === 3) return isExpired(cert.expiryDate);
    return true;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Certificates & Awards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your professional certificates, awards, and qualifications.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CertificateIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.totalCertificates}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Certificates
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <VerifiedIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.verificationRate}%</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WarningIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.expiringCertificates}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiring Soon
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CancelIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.expiredCertificates}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="certificate">Certificates</MenuItem>
                <MenuItem value="award">Awards</MenuItem>
                <MenuItem value="license">Licenses</MenuItem>
                <MenuItem value="qualification">Qualifications</MenuItem>
                <MenuItem value="course">Courses</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add New
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Certificates List */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="All Certificates" />
          <Tab label="Verified" />
          <Tab label="Expiring Soon" />
          <Tab label="Expired" />
        </Tabs>

        <Grid container spacing={3}>
          {filteredCertificates.map((certificate) => (
            <Grid item xs={12} md={6} key={certificate.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: getCategoryColor(certificate.category), mr: 2 }}>
                        {getCategoryIcon(certificate.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {certificate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {certificate.issuer}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {certificate.isVerified && (
                        <Tooltip title="Verified">
                          <VerifiedIcon color="success" fontSize="small" />
                        </Tooltip>
                      )}
                      {isExpiringSoon(certificate.expiryDate) && (
                        <Tooltip title="Expiring Soon">
                          <WarningIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                      {isExpired(certificate.expiryDate) && (
                        <Tooltip title="Expired">
                          <CancelIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Chip
                      label={certificate.category}
                      color={getCategoryColor(certificate.category)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" component="span">
                      Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                    </Typography>
                    {certificate.expiryDate && (
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 2 }}>
                        Expires: {new Date(certificate.expiryDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {certificate.description && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {certificate.description.substring(0, 100)}
                      {certificate.description.length > 100 && '...'}
                    </Typography>
                  )}

                  {certificate.skills && certificate.skills.length > 0 && (
                    <Box mb={2}>
                      {certificate.skills.slice(0, 3).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {certificate.skills.length > 3 && (
                        <Chip
                          label={`+${certificate.skills.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      )}
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1}>
                    {certificate.fileName && (
                      <Tooltip title="Has attachment">
                        <AttachFileIcon fontSize="small" color="action" />
                      </Tooltip>
                    )}
                    {certificate.credentialUrl && (
                      <Tooltip title="Has credential URL">
                        <LinkIcon fontSize="small" color="action" />
                      </Tooltip>
                    )}
                    {certificate.credentialId && (
                      <Typography variant="caption" color="text.secondary">
                        ID: {certificate.credentialId}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => openEditDialog(certificate)}
                  >
                    Edit
                  </Button>
                  {certificate.fileName && (
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadCertificate(certificate.id, certificate.fileName)}
                    >
                      Download
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteCertificate(certificate.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    color={certificate.isVerified ? "default" : "success"}
                    startIcon={certificate.isVerified ? <CancelIcon /> : <CheckCircleIcon />}
                    onClick={() => handleVerifyCertificate(certificate.id, !certificate.isVerified)}
                  >
                    {certificate.isVerified ? 'Unverify' : 'Verify'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredCertificates.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No certificates found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first certificate to get started!
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create/Edit Certificate Dialog */}
      <Dialog 
        open={createDialogOpen || editDialogOpen} 
        onClose={() => {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          resetForm();
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {createDialogOpen ? 'Add New Certificate' : 'Edit Certificate'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Certificate Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Certificate['category'] })}
                    label="Category"
                  >
                    <MenuItem value="certificate">Certificate</MenuItem>
                    <MenuItem value="award">Award</MenuItem>
                    <MenuItem value="license">License</MenuItem>
                    <MenuItem value="qualification">Qualification</MenuItem>
                    <MenuItem value="course">Course</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Credential URL"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Add Skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button onClick={addSkill}>Add</Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <input
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                    style={{ display: 'none' }}
                    id="certificate-file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="certificate-file">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      {selectedFile ? selectedFile.name : 'Upload Certificate File'}
                    </Button>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    />
                  }
                  label="Mark as Verified"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            onClick={createDialogOpen ? handleCreateCertificate : handleUpdateCertificate}
            variant="contained"
            disabled={!formData.name || !formData.issuer || !formData.issueDate}
          >
            {createDialogOpen ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CertificatesPage;