# JobsPage Natural Language Search Integration

## Changes Required

### 1. Add Imports (Line 43)
```typescript
import { AutoAwesome } from '@mui/icons-material';
import NaturalLanguageSearch from '../components/NaturalLanguageSearch';
```

### 2. Add State for NL Search Results (After line 79)
```typescript
const [nlSearchResults, setNlSearchResults] = useState<JobMatch[]>([]);
```

### 3. Add NL Search Handler (After clearFilters function)
```typescript
const handleNLSearch = (results: any) => {
  // Transform API results to JobMatch format
  const transformedResults = results.map((result: any) => ({
    jobId: result.job.id,
    score: result.score,
    matchReasons: result.matchReasons,
    job: result.job
  }));
  setNlSearchResults(transformedResults);
};
```

### 4. Update useEffect to handle 3 tabs (Line 83)
```typescript
useEffect(() => {
  if (activeTab === 0) {
    fetchMatchedJobs();
  } else if (activeTab === 1) {
    fetchAllJobs();
  }
  // Tab 2 (NL Search) doesn't auto-fetch
}, [activeTab]);
```

### 5. Add Third Tab (After line 273)
```typescript
<Tab 
  label="Natural Language Search" 
  icon={<AutoAwesome />} 
  iconPosition="start"
/>
```

### 6. Add NL Search Tab Content (After All Jobs tab content, around line 550)
```typescript
{/* Natural Language Search Tab */}
{activeTab === 2 && (
  <>
    <NaturalLanguageSearch onSearch={handleNLSearch} />
    
    {nlSearchResults.length === 0 ? (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Try Natural Language Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for jobs using natural language like "Senior React developer in New York with 100k+ salary"
        </Typography>
      </Paper>
    ) : (
      <Grid container spacing={3}>
        {nlSearchResults.map((match) => (
          <Grid item xs={12} md={6} key={match.job.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {match.job.title}
                  </Typography>
                  <Chip
                    label={`${Math.round(match.score * 100)}% Match`}
                    color={getMatchScoreColor(match.score)}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {match.job.company}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {match.job.location} • {match.job.jobType}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatSalary(match.job.salaryMin, match.job.salaryMax, match.job.salaryCurrency)}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {match.job.description.substring(0, 150)}...
                </Typography>

                {match.matchReasons.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                      Why this matches:
                    </Typography>
                    {match.matchReasons.slice(0, 2).map((reason, index) => (
                      <Typography key={index} variant="body2" color="success.main" sx={{ fontSize: '0.875rem' }}>
                        • {reason}
                      </Typography>
                    ))}
                  </Box>
                )}

                {match.job.requiredSkills && match.job.requiredSkills.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {match.job.requiredSkills.slice(0, 4).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {match.job.requiredSkills.length > 4 && (
                      <Chip
                        label={`+${match.job.requiredSkills.length - 4} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button size="small" onClick={() => handleJobClick(match.job)}>
                  View Details
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Launch />}
                  href={match.job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </>
)}
```

## Summary
- Adds third tab for Natural Language Search
- Integrates existing NaturalLanguageSearch component
- Reuses existing job card layout for consistency
- Shows match scores and reasons like Matched Jobs tab
