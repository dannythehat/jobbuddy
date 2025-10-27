# Feature: Job Description Summarizer

## Overview
AI-powered job description summarizer using OpenAI to create 3 concise bullet points.

## Time Estimate: 1 hour

## Implementation Steps

### Step 1: Create Summarizer Service (25 min)
**File**: `backend/src/services/jobSummarizerService.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class JobSummarizerService {
  async summarizeJob(description: string): Promise<string[]> {
    const prompt = `Summarize this job description into exactly 3 concise bullet points. 
Focus on: key responsibilities, required skills, and what makes it unique.

Job Description:
${description}

Format: Return only 3 bullet points, no introduction.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const summary = response.choices[0].message.content || '';
    
    // Parse bullet points
    const bullets = summary
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .slice(0, 3);

    return bullets;
  }

  async summarizeJobBatch(jobs: Array<{ id: string; description: string }>) {
    const summaries = await Promise.all(
      jobs.map(async (job) => ({
        id: job.id,
        summary: await this.summarizeJob(job.description)
      }))
    );
    return summaries;
  }
}

export const jobSummarizerService = new JobSummarizerService();
```

### Step 2: Add API Endpoint (15 min)
**File**: `backend/src/routes/jobRoutes.ts`

```typescript
import { jobSummarizerService } from '../services/jobSummarizerService';

// Add to existing routes
router.post('/jobs/:jobId/summarize', protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await pool.query(
      'SELECT description FROM jobs WHERE id = $1',
      [jobId]
    );
    
    if (!job.rows[0]) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const summary = await jobSummarizerService.summarizeJob(
      job.rows[0].description
    );
    
    res.json({ success: true, data: { summary } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 3: Frontend Component (20 min)
**File**: `frontend/src/components/JobSummary.tsx`

```typescript
import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { AutoAwesome, CheckCircle } from '@mui/icons-material';

interface JobSummaryProps {
  jobId: string;
}

const JobSummary: React.FC<JobSummaryProps> = ({ jobId }) => {
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}/summarize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSummary(data.data.summary);
    } catch (error) {
      console.error('Summary error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {summary.length === 0 ? (
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
          onClick={generateSummary}
          disabled={loading}
        >
          AI Summary
        </Button>
      ) : (
        <List dense>
          {summary.map((point, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={point} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default JobSummary;
```

### Step 4: Add to JobsPage (10 min)
**File**: `frontend/src/pages/JobsPage.tsx`

```typescript
import JobSummary from '../components/JobSummary';

// In job card display
<Card>
  <CardContent>
    <Typography variant="h6">{job.title}</Typography>
    <Typography color="text.secondary">{job.company}</Typography>
    
    {/* Add summary component */}
    <JobSummary jobId={job.id} />
    
    <Typography variant="body2">{job.description}</Typography>
  </CardContent>
</Card>
```

## Environment Setup
```bash
# Add to backend/.env
OPENAI_API_KEY=sk-...
```

## Testing

### Test 1: API Endpoint
```bash
curl -X POST http://localhost:3001/api/jobs/123/summarize \
  -H "Authorization: Bearer TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "summary": [
      "Lead development of React applications with TypeScript",
      "Requires 5+ years experience with modern frontend frameworks",
      "Remote-first company with competitive salary and equity"
    ]
  }
}
```

### Test 2: Frontend
- Navigate to Jobs page
- Click "AI Summary" button
- Verify 3 bullet points appear
- Check loading state works

## Cost Estimate
- GPT-3.5-turbo: ~$0.002 per summary
- 1000 summaries = ~$2

## Benefits
- ✅ Quick job understanding
- ✅ Better user experience
- ✅ Reduces reading time
- ✅ Highlights key points

## Files to Create
- `backend/src/services/jobSummarizerService.ts`
- `frontend/src/components/JobSummary.tsx`

## Files to Modify
- `backend/src/routes/jobRoutes.ts`
- `frontend/src/pages/JobsPage.tsx`
- `backend/.env.example`

Ready to implement?
