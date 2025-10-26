# Phase 7.1.1 - Job Fetching Testing Guide

## Prerequisites
- Backend server running
- LinkedIn account connected via OAuth
- Database migrations applied

## Test 1: Sync Single Connection

### Get Connection ID
```bash
curl -X GET http://localhost:3001/api/job-boards/connections \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Trigger Sync
```bash
curl -X POST http://localhost:3001/api/job-boards/sync/CONNECTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "software engineer",
    "location": "San Francisco",
    "remote": true,
    "posted_within_days": 7
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "success": true,
    "jobsFetched": 25,
    "jobsStored": 23,
    "duplicatesSkipped": 2,
    "errors": []
  }
}
```

## Test 2: Sync All Connections

```bash
curl -X POST http://localhost:3001/api/job-boards/sync-all \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "react developer",
    "remote": true
  }'
```

## Test 3: Verify Jobs in Database

```sql
-- Check stored jobs
SELECT 
  id, external_id, provider_id, title, company, 
  location, remote, posted_date
FROM job_board_jobs
ORDER BY created_at DESC
LIMIT 10;

-- Check for duplicates
SELECT external_id, provider_id, COUNT(*)
FROM job_board_jobs
GROUP BY external_id, provider_id
HAVING COUNT(*) > 1;

-- Check sync status
SELECT 
  provider_id, last_sync_at, connection_status
FROM user_job_board_connections
WHERE user_id = 'YOUR_USER_ID';
```

## Test 4: Rate Limiting

Run multiple requests quickly to test rate limiting:

```bash
for i in {1..5}; do
  curl -X POST http://localhost:3001/api/job-boards/sync/CONNECTION_ID \
    -H "Authorization: Bearer YOUR_TOKEN" &
done
```

Should see requests throttled appropriately.

## Test 5: Error Handling

### Test Invalid Connection
```bash
curl -X POST http://localhost:3001/api/job-boards/sync/invalid-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 404 error

### Test Expired Token
Manually expire a token in database, then sync.
Expected: Error in response with token refresh suggestion.

## Success Criteria

✅ Jobs fetched from LinkedIn
✅ Jobs stored in database without duplicates
✅ Connection last_sync_at updated
✅ Rate limiting working
✅ Error handling graceful
✅ Deduplication working

## Troubleshooting

### No jobs returned
- Check LinkedIn API credentials
- Verify access token is valid
- Check search parameters

### Duplicate jobs
- Check deduplication logic
- Verify external_id uniqueness

### Rate limit errors
- Adjust rate limit config in LinkedInClient
- Add delays between syncs
