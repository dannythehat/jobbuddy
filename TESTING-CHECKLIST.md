# Testing Checklist

## ✅ Pre-Development Tests

### Verify Setup
```bash
./scripts/verify-setup.sh
```
Expected: All files present ✅

### Test Backend
```bash
cd backend
npm run dev
# Visit: http://localhost:3001/api/health
```
Expected: Status 200, version 2.1.0-phase6.1

### Test Frontend
```bash
cd frontend
npm start
# Visit: http://localhost:3000
```
Expected: App loads, login page visible

---

## 🧪 Phase 7 Integration Tests

### After Adding Routes
```bash
# Test providers endpoint
curl http://localhost:3001/api/job-boards/providers

# Expected: List of 12 providers
```

### After Database Migration
```bash
psql -U postgres -d jobbuddy -c "SELECT COUNT(*) FROM job_board_providers;"

# Expected: 12
```

### After OAuth Setup
```bash
# Test connection initiation
curl -X POST http://localhost:3001/api/job-boards/connect/linkedin \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: { authorization_url: "..." }
```

---

## 🔍 Phase 6.1 Frontend Tests

### Test Natural Language Search
1. Go to Jobs page
2. Enter: "Remote React jobs"
3. Click search
4. Verify: Results appear
5. Check: Parsed query shown

### Test Example Queries
- "Senior Python developer London"
- "Part-time marketing £30k+"
- "Contract JavaScript remote"

---

## 📊 Phase 7.1.1 Job Fetching Tests

### Test Job Sync
```bash
# Trigger sync
curl -X POST http://localhost:3001/api/job-boards/sync/CONNECTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check database
psql -U postgres -d jobbuddy -c "SELECT COUNT(*) FROM job_board_jobs;"
```

### Test Deduplication
1. Sync same provider twice
2. Check job count doesn't double
3. Verify external_id uniqueness

---

## 🐛 Common Issues

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9
```

### Database Connection Failed
```bash
# Check PostgreSQL running
pg_isready

# Restart if needed
brew services restart postgresql
```

### OAuth Redirect Failed
- Check BACKEND_URL in .env
- Verify callback URL matches provider settings

---

## ✅ Success Criteria

- [ ] All setup tests pass
- [ ] Health endpoint returns 200
- [ ] Phase 7 routes accessible
- [ ] Database has 12 providers
- [ ] NL search returns results
- [ ] Job sync works without errors