# Phase 7.1 Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Run Migration
```bash
psql -U postgres -d jobbuddy -f migrations/007_job_board_integrations.sql
```

### 2. Add to .env
```bash
# Generate key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
ENCRYPTION_KEY=<your_generated_key>
BACKEND_URL=http://localhost:5000
```

### 3. Update Server
```typescript
// backend/src/server.ts or app.ts
import jobBoardRoutes from './routes/jobBoardRoutes';
import oauthRoutes from './routes/oauthRoutes';

app.use('/api/job-boards', jobBoardRoutes);
app.use('/api/oauth', oauthRoutes);
```

### 4. Restart
```bash
cd backend && npm run dev
```

## 📡 API Quick Reference

### List Providers
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/job-boards/providers
```

### Get Connections
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/job-boards/connections
```

### Connect LinkedIn
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/job-boards/connect/linkedin
```

### Check Health
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/job-boards/connections/health
```

## 🗂️ Files Created

```
migrations/
  └── 007_job_board_integrations.sql

backend/src/
  ├── types/
  │   └── jobBoard.ts
  ├── services/
  │   ├── jobBoardOAuthService.ts
  │   └── jobBoardConnectionService.ts
  └── routes/
      ├── jobBoardRoutes.ts
      └── oauthRoutes.ts

docs/
  ├── phase-7-spec.md
  ├── phase-7.1-implementation.md
  ├── job-board-oauth-setup.md
  ├── PHASE-7-UPDATE.md
  ├── README-PHASE7-UPDATE.md
  └── PHASE-7-BUILD-SUMMARY.md
```

## 🔐 Security Checklist

- [x] Tokens encrypted with AES-256-GCM
- [x] OAuth state parameter CSRF protection
- [x] Secure token storage
- [x] Automatic token refresh
- [x] Error handling
- [x] Connection health monitoring

## 📊 Database Tables

- `job_board_providers` - 12 providers
- `user_job_board_connections` - User connections
- `job_board_jobs` - Job listings
- `job_search_history` - Search tracking

## 🎯 Supported Providers

✅ LinkedIn, Indeed, Glassdoor, ZipRecruiter
✅ Monster, CareerBuilder, Dice
✅ Naukri (India), Seek (AU/NZ)
✅ Reed, Totaljobs (UK), StepStone (EU)

## 🔄 OAuth Flow

1. User clicks "Connect LinkedIn"
2. Backend generates auth URL
3. User redirects to LinkedIn
4. User authorizes
5. LinkedIn redirects back with code
6. Backend exchanges code for token
7. Token encrypted and stored
8. Connection active!

## 🧪 Testing

### Without OAuth
- System works in "free mode"
- Shows providers as "not configured"
- Graceful degradation

### With OAuth
- Add credentials to `.env`
- Test full OAuth flow
- Verify token encryption
- Check auto-refresh

## 📝 Next Steps

1. **Job Fetching** - Implement API clients
2. **Search Aggregation** - Multi-platform search
3. **Frontend UI** - Connection management
4. **Testing** - Real provider integration

## 💡 Pro Tips

- Generate strong encryption key
- Never commit `.env` to Git
- Test OAuth flow in incognito
- Monitor connection health
- Set up error alerts

## 🆘 Troubleshooting

**Migration fails?**
- Check PostgreSQL connection
- Verify database exists
- Run as postgres user

**OAuth not working?**
- Check credentials in `.env`
- Verify redirect URIs match
- Check provider dashboard settings

**Tokens not encrypting?**
- Verify ENCRYPTION_KEY is 64 hex chars
- Check key is in `.env`
- Restart backend after adding key

## 📚 Documentation

- Full spec: `docs/phase-7-spec.md`
- Implementation: `docs/phase-7.1-implementation.md`
- OAuth setup: `docs/job-board-oauth-setup.md`
- Build summary: `docs/PHASE-7-BUILD-SUMMARY.md`

## ✅ Checklist

- [ ] Run migration
- [ ] Add encryption key
- [ ] Update server routes
- [ ] Restart backend
- [ ] Test API endpoints
- [ ] (Optional) Add OAuth credentials
- [ ] Test OAuth flow
- [ ] Build frontend UI

---

**Status:** Phase 7.1 Foundation Complete ✅
**Next:** Job Fetching & Search Aggregation
