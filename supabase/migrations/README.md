# Supabase Migrations

## 📋 Migration Files

These SQL files will create your JobBuddi database schema in Supabase:

1. `001_create_users_table.sql` - Users and authentication
2. `002_create_cvs_table.sql` - CV/Resume storage
3. `003_create_jobs_table.sql` - Job listings
4. `004_create_job_preferences_table.sql` - User job preferences
5. `005_create_applications_table.sql` - Job applications tracking

## 🚀 How to Run Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://rdgjbwndlgcgfjoosjuw.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste each migration file **in order** (001, 002, 003, etc.)
5. Click **Run** for each migration
6. Verify success (you should see "Success. No rows returned")

### Option 2: Command Line (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rdgjbwndlgcgfjoosjuw

# Run migrations
supabase db push
```

## ✅ Verify Migrations

After running all migrations, verify in Supabase:

1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - ✅ users
   - ✅ cvs
   - ✅ jobs
   - ✅ job_preferences
   - ✅ applications

## 🔄 Next Steps

After migrations are complete:

1. Update your `backend/.env` file with Supabase credentials
2. Test the connection
3. Start using your cloud database!

## 🆘 Troubleshooting

### "relation already exists" error
- Table already created, safe to ignore or drop table first

### Permission denied
- Make sure you're using the service_role key
- Check you're in the correct project

### Foreign key constraint error
- Run migrations in order (001, 002, 003, etc.)
- Don't skip any migrations
