# Job Board Providers Migration Guide

## Overview
This migration adds 10 job board providers to your JobBuddi database, enabling multi-platform job search across global and regional job boards.

## Providers Added

### Global Platforms
- **LinkedIn** - Professional networking (100 req/hr)
- **Indeed** - World's largest job site (100 req/hr)
- **Glassdoor** - Reviews + salary data (1000 req/day)
- **ZipRecruiter** - AI matching (500 req/hr)
- **Monster** - Traditional job board (200 req/hr)

### Regional Leaders
- **Reed** - UK market leader (200 req/hr)
- **Seek** - Australia/NZ/APAC (300 req/hr)
- **Naukri** - India's largest (250 req/hr)

### Specialized
- **Dice** - Tech jobs (150 req/hr)
- **Wellfound** - Startups (100 req/hr)

## Running the Migration

### Option 1: Using Node.js Script (Recommended)
```bash
cd backend
node scripts/migrate-job-board-providers.js
```

### Option 2: Direct SQL
```bash
psql -U postgres -d jobbuddy -f backend/migrations/007_add_job_board_providers.sql
```

### Option 3: Using npm script
Add to `package.json`:
```json
{
  "scripts": {
    "migrate:providers": "node scripts/migrate-job-board-providers.js"
  }
}
```

Then run:
```bash
npm run migrate:providers
```

## Expected Output

```
🚀 Starting job board providers migration...

✅ Migration completed successfully!

📊 Registered Job Board Providers:

┌─────────────────────────────────────────────────────────────────┐
│ Provider          │ Countries │ Rate Limit │ Status            │
├─────────────────────────────────────────────────────────────────┤
│ Dice              │ 2         │ 150/hr     │ ✅ Active         │
│ Glassdoor         │ 7         │ 1000/hr    │ ✅ Active         │
│ Indeed            │ 10        │ 100/hr     │ ✅ Active         │
│ LinkedIn          │ 10        │ 100/hr     │ ✅ Active         │
│ Monster           │ 9         │ 200/hr     │ ✅ Active         │
│ Naukri.com        │ 1         │ 250/hr     │ ✅ Active         │
│ Reed.co.uk        │ 1         │ 200/hr     │ ✅ Active         │
│ SEEK              │ 8         │ 300/hr     │ ✅ Active         │
│ Wellfound         │ 7         │ 100/hr     │ ✅ Active         │
│ ZipRecruiter      │ 3         │ 500/hr     │ ✅ Active         │
└─────────────────────────────────────────────────────────────────┘

✨ Total providers registered: 10

🌍 Top Regions by Provider Coverage:

   US: 9 providers
   UK: 7 providers
   CA: 6 providers
   IN: 5 providers
   AU: 4 providers
   DE: 5 providers
   FR: 5 providers
   SG: 3 providers
   NZ: 2 providers
   HK: 2 providers

🎉 Job board providers are ready to use!
```

## Database Schema

The migration populates the `job_board_providers` table with:

- **id**: Unique provider identifier
- **name**: Internal name (lowercase)
- **display_name**: User-facing name
- **logo_url**: Provider logo
- **website_url**: Provider website
- **is_premium**: Premium features flag
- **oauth_provider**: OAuth configuration
- **api_base_url**: API endpoint
- **rate_limit_per_hour**: API rate limit
- **supported_countries**: Array of country codes
- **description**: Provider description
- **is_active**: Active status

## Indexes Created

1. `idx_job_board_providers_active` - Fast active provider queries
2. `idx_job_board_providers_premium` - Premium provider filtering
3. `idx_job_board_providers_countries` - GIN index for country searches

## Verification

After migration, verify with:

```sql
-- Count active providers
SELECT COUNT(*) FROM job_board_providers WHERE is_active = true;

-- List all providers
SELECT id, display_name, supported_countries 
FROM job_board_providers 
ORDER BY display_name;

-- Providers by region
SELECT 
  UNNEST(supported_countries) as country,
  COUNT(*) as provider_count
FROM job_board_providers
WHERE is_active = true
GROUP BY country
ORDER BY provider_count DESC;
```

## Rollback

If needed, rollback with:

```sql
DELETE FROM job_board_providers 
WHERE id IN (
  'linkedin', 'indeed', 'glassdoor', 'ziprecruiter', 'monster',
  'reed', 'seek', 'naukri', 'dice', 'wellfound'
);
```

## Next Steps

1. ✅ Run this migration
2. Configure OAuth credentials for each provider
3. Test provider connections
4. Enable user connections via UI
5. Start multi-platform job searches!

## Troubleshooting

### Error: Table doesn't exist
Run the base schema migration first:
```bash
node scripts/init-db.js
```

### Error: Connection refused
Check your `.env` file has correct database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobbuddy
DB_USER=postgres
DB_PASSWORD=your_password
```

### Error: Duplicate key
Migration is idempotent - it uses `ON CONFLICT DO UPDATE`, so it's safe to run multiple times.

## Support

For issues or questions:
- Check logs in console output
- Verify database connection
- Ensure PostgreSQL is running
- Check migration file syntax

---

**Phase 7.1 - Job Board Integration**  
*Last Updated: October 2025*
