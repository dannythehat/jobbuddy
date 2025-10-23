import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Stack,
  Badge,
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Help as HelpIcon,
  Work as WorkIcon,
  MonetizationOn as MonetizationOnIcon,
  Event as EventIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Response {
  id: string;
  applicationId: string;
  subject: string;
  sender: string;
  senderName?: string;
  recipient: string;
  receivedDate: string;
  content: string;
  classification: 'interview_invite' | 'rejection' | 'request_info' | 'acknowledgment' | 'offer' | 'follow_up' | 'other';
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  extractedData?: {
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: 'phone' | 'video' | 'in_person' | 'panel';
    interviewers?: string[];
    nextSteps?: string;
    deadline?: string;
    salaryMention?: number;
    benefits?: string[];
    rejectionReason?: string;
    feedback?: string;
  };
  processed: boolean;
  processingDate?: string;
  processingNotes?: string;
  actionRequired: boolean;
  actionTaken?: string;
  actionDate?: string;
  application?: {
    id: string;
    job?: {
      id: string;
      title: string;
      company: string;
      location: string;
    };
  };
}

interface Analytics {
  classificationStats: Array<{ classification: string; count: number }>;
  sentimentStats: Array<{ sentiment: string; count: number }>;
  processingStats: Array<{ processed: boolean; count: number }>;
  actionRequiredCount: number;
  timeline: Array<{ date: string; count: number }>;
  timeframe: number;
}

const ResponsesPage: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    classification: '',
    processed: '',
    actionRequired: '',
    search: '',
    page: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchResponses();
    fetchAnalytics();
  }, [filters]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/responses?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResponses(data.data.responses);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/responses/analytics?timeframe=30', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleBatchProcess = async () => {
    try {
      setProcessing(true);
      const response = await fetch('/api/responses/batch-process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        await fetchResponses();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Error batch processing:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReclassify = async (responseId: string) => {
    try {
      const response = await fetch(`/api/responses/${responseId}/reclassify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        await fetchResponses();
      }
    } catch (error) {
      console.error('Error reclassifying response:', error);
    }
  };

  const handleMarkProcessed = async (responseId: string, processed: boolean) => {
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ processed }),
      });

      if (response.ok) {
        await fetchResponses();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Error updating response:', error);
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'interview_invite': return <EventIcon />;
      case 'rejection': return <ThumbDownIcon />;
      case 'offer': return <MonetizationOnIcon />;
      case 'acknowledgment': return <CheckCircleIcon />;
      case 'request_info': return <InfoIcon />;
      case 'follow_up': return <ScheduleIcon />;
      default: return <HelpIcon />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'interview_invite': return 'success';
      case 'rejection': return 'error';
      case 'offer': return 'primary';
      case 'acknowledgment': return 'info';
      case 'request_info': return 'warning';
      case 'follow_up': return 'secondary';
      default: return 'default';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbUpIcon color="success" />;
      case 'negative': return <ThumbDownIcon color="error" />;
      default: return <HelpIcon color="disabled" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Response Monitoring
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        AI-powered email classification and response tracking for your job applications
      </Typography>

      {/* Analytics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Responses</Typography>
                </Box>
                <Typography variant="h4">
                  {analytics.classificationStats.reduce((sum, stat) => sum + stat.count, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Action Required</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {analytics.actionRequiredCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Needs attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Interviews</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {analytics.classificationStats.find(s => s.classification === 'interview_invite')?.count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interview invites
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Offers</Typography>
                </Box>
                <Typography variant="h4" color="primary.main">
                  {analytics.classificationStats.find(s => s.classification === 'offer')?.count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Job offers received
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search responses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Classification</InputLabel>
                <Select
                  value={filters.classification}
                  onChange={(e) => setFilters({ ...filters, classification: e.target.value, page: 1 })}
                  label="Classification"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="interview_invite">Interview Invite</MenuItem>
                  <MenuItem value="rejection">Rejection</MenuItem>
                  <MenuItem value="offer">Offer</MenuItem>
                  <MenuItem value="acknowledgment">Acknowledgment</MenuItem>
                  <MenuItem value="request_info">Request Info</MenuItem>
                  <MenuItem value="follow_up">Follow Up</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.processed}
                  onChange={(e) => setFilters({ ...filters, processed: e.target.value, page: 1 })}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Processed</MenuItem>
                  <MenuItem value="false">Unprocessed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Action Required</InputLabel>
                <Select
                  value={filters.actionRequired}
                  onChange={(e) => setFilters({ ...filters, actionRequired: e.target.value, page: 1 })}
                  label="Action Required"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchResponses}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={handleBatchProcess}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Batch Process'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {processing && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Processing unprocessed responses...
          </Typography>
        </Box>
      )}

      {/* Responses List */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {responses.map((response) => (
            <Grid item xs={12} key={response.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 },
                  border: response.actionRequired ? '2px solid' : '1px solid',
                  borderColor: response.actionRequired ? 'warning.main' : 'divider',
                }}
                onClick={() => {
                  setSelectedResponse(response);
                  setDetailsOpen(true);
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getClassificationIcon(response.classification)}
                        <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                          {response.subject}
                        </Typography>
                        <Chip
                          label={response.classification.replace('_', ' ')}
                          color={getClassificationColor(response.classification) as any}
                          size="small"
                        />
                        {response.actionRequired && (
                          <Badge color="warning" variant="dot" sx={{ ml: 1 }}>
                            <WarningIcon color="warning" fontSize="small" />
                          </Badge>
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        From: {response.senderName || response.sender}
                      </Typography>
                      
                      {response.application?.job && (
                        <Typography variant="body2" color="text.secondary">
                          Job: {response.application.job.title} at {response.application.job.company}
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getSentimentIcon(response.sentiment)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Confidence: {Math.round(response.confidence * 100)}%
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(response.receivedDate), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {response.processed ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Processed"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            icon={<ScheduleIcon />}
                            label="Pending"
                            color="warning"
                            size="small"
                          />
                        )}
                        
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReclassify(response.id);
                          }}
                        >
                          Reclassify
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Response Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedResponse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Response Details</Typography>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Email Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Subject"
                        secondary={selectedResponse.subject}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="From"
                        secondary={`${selectedResponse.senderName || selectedResponse.sender} (${selectedResponse.sender})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Received"
                        secondary={format(new Date(selectedResponse.receivedDate), 'PPpp')}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Classification
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        {getClassificationIcon(selectedResponse.classification)}
                      </ListItemIcon>
                      <ListItemText
                        primary="Type"
                        secondary={selectedResponse.classification.replace('_', ' ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Confidence"
                        secondary={`${Math.round(selectedResponse.confidence * 100)}%`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {getSentimentIcon(selectedResponse.sentiment)}
                      </ListItemIcon>
                      <ListItemText
                        primary="Sentiment"
                        secondary={`${selectedResponse.sentiment} (${selectedResponse.sentimentScore.toFixed(2)})`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                {selectedResponse.extractedData && Object.keys(selectedResponse.extractedData).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Extracted Information
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      {selectedResponse.extractedData.interviewDate && (
                        <Typography variant="body2">
                          <strong>Interview Date:</strong> {format(new Date(selectedResponse.extractedData.interviewDate), 'PPpp')}
                        </Typography>
                      )}
                      {selectedResponse.extractedData.interviewLocation && (
                        <Typography variant="body2">
                          <strong>Location:</strong> {selectedResponse.extractedData.interviewLocation}
                        </Typography>
                      )}
                      {selectedResponse.extractedData.interviewType && (
                        <Typography variant="body2">
                          <strong>Type:</strong> {selectedResponse.extractedData.interviewType}
                        </Typography>
                      )}
                      {selectedResponse.extractedData.salaryMention && (
                        <Typography variant="body2">
                          <strong>Salary Mentioned:</strong> ${selectedResponse.extractedData.salaryMention.toLocaleString()}
                        </Typography>
                      )}
                      {selectedResponse.extractedData.nextSteps && (
                        <Typography variant="body2">
                          <strong>Next Steps:</strong> {selectedResponse.extractedData.nextSteps}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Email Content
                  </Typography>
                  <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto', bgcolor: 'grey.50' }}>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedResponse.content}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button
                onClick={() => handleMarkProcessed(selectedResponse.id, !selectedResponse.processed)}
                color={selectedResponse.processed ? 'warning' : 'success'}
              >
                Mark as {selectedResponse.processed ? 'Unprocessed' : 'Processed'}
              </Button>
              <Button onClick={() => handleReclassify(selectedResponse.id)}>
                Reclassify
              </Button>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Empty State */}
      {!loading && responses.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <EmailIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No responses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email responses will appear here once they're received and processed.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ResponsesPage;