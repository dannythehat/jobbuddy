# Supabase Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Visit https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or Email

### Step 2: Create New Project

1. Click **"New Project"**
2. Fill in project details:
   ```
   Name: jobbuddi
   Database Password: [Create a strong password - SAVE THIS!]
   Region: [Choose closest to your location]
   Pricing Plan: Free
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for provisioning

### Step 3: Get Your Credentials

#### API Credentials
1. Go to **Project Settings** (⚙️ gear icon in sidebar)
2. Click **"API"** in the left menu
3. Copy these values:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  (long string)
SUPABASE_SERVICE_KEY=eyJhbGc...  (long string - KEEP SECRET!)
```

#### Database Connection String
1. Still in **Project Settings**
2. Click **"Database"** in the left menu
3. Scroll to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string:

```env
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with the database password you created in Step 2!

### Step 4: Update Your .env File

1. Copy `backend/.env.example` to `backend/.env`
2. Add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Enable Supabase
USE_SUPABASE=true
```

### Step 5: Verify Connection

Once you have your credentials, I can help you:
1. Create the database schema in Supabase
2. Test the connection
3. Migrate your data (if any)

## 🔐 Security Notes

### Keep These SECRET:
- ❌ **SUPABASE_SERVICE_KEY** - Never commit to Git!
- ❌ **Database Password** - Store securely!

### Safe to Share:
- ✅ **SUPABASE_URL** - Public project URL
- ✅ **SUPABASE_ANON_KEY** - Public anonymous key (has RLS protection)

## 📊 Free Tier Limits

Your free Supabase project includes:
- ✅ 500MB database storage
- ✅ 1GB file storage  
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ Unlimited API requests
- ✅ 500MB Edge Functions

**Perfect for development and small production apps!**

## 🎯 Next Steps

After completing this setup:

1. **Tell me you're done** - I'll verify your connection
2. **Create database schema** - I'll set up all tables automatically
3. **Test the connection** - We'll run a quick test
4. **Start using Supabase** - Your app will be cloud-ready!

## 🆘 Troubleshooting

### Can't find Project Settings?
- Look for the ⚙️ gear icon in the left sidebar
- It's at the bottom of the navigation menu

### Connection string not working?
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check for special characters - they might need URL encoding
- Verify the region matches your project

### Need help?
Just let me know where you're stuck and I'll guide you through it!

---

**Ready?** Once you have your credentials, paste them here and I'll help you set up the database! 🚀