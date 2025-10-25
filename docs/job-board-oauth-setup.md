# Phase 7.1: Job Board Integration Environment Variables

Add these to your `backend/.env` file:

## OAuth Configuration

### LinkedIn
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### Indeed
```env
INDEED_CLIENT_ID=your_indeed_client_id
INDEED_CLIENT_SECRET=your_indeed_client_secret
```

### Glassdoor
```env
GLASSDOOR_CLIENT_ID=your_glassdoor_client_id
GLASSDOOR_CLIENT_SECRET=your_glassdoor_client_secret
```

### ZipRecruiter
```env
ZIPRECRUITER_CLIENT_ID=your_ziprecruiter_client_id
ZIPRECRUITER_CLIENT_SECRET=your_ziprecruiter_client_secret
```

### Monster
```env
MONSTER_CLIENT_ID=your_monster_client_id
MONSTER_CLIENT_SECRET=your_monster_client_secret
```

## Security

### Token Encryption
```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_64_character_hex_encryption_key
```

## Backend URL
```env
# For OAuth callbacks
BACKEND_URL=http://localhost:5000
```

## How to Get OAuth Credentials

### LinkedIn
1. Go to https://www.linkedin.com/developers/apps
2. Create new app
3. Add redirect URI: `http://localhost:5000/api/oauth/linkedin/callback`
4. Copy Client ID and Client Secret

### Indeed
1. Go to https://secure.indeed.com/account/apikeys
2. Create API key
3. Add redirect URI: `http://localhost:5000/api/oauth/indeed/callback`
4. Copy credentials

### Glassdoor
1. Go to https://www.glassdoor.com/developer/index.htm
2. Register application
3. Add redirect URI: `http://localhost:5000/api/oauth/glassdoor/callback`
4. Copy API key and secret

### ZipRecruiter
1. Contact ZipRecruiter API team
2. Request API access
3. Provide redirect URI: `http://localhost:5000/api/oauth/ziprecruiter/callback`
4. Receive credentials

### Monster
1. Go to https://partner.monster.com/
2. Register as partner
3. Add redirect URI: `http://localhost:5000/api/oauth/monster/callback`
4. Copy credentials

## Production Configuration

For production, update redirect URIs to your production domain:
```env
BACKEND_URL=https://api.yourdomain.com
```

And update all OAuth redirect URIs in provider dashboards to:
- `https://api.yourdomain.com/api/oauth/linkedin/callback`
- `https://api.yourdomain.com/api/oauth/indeed/callback`
- etc.

## Testing Without OAuth

For development/testing without OAuth credentials, the system will:
- Show providers as "not configured"
- Allow manual job search without premium features
- Skip OAuth-dependent features gracefully

## Security Notes

⚠️ **NEVER commit these credentials to Git!**
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys regularly
- Use different keys for dev/staging/production
