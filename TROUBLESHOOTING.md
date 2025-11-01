# 🔧 JobBuddy Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **1. Docker Issues**

#### **"Cannot connect to Docker daemon"**
**Solution:**
- Make sure Docker Desktop is running
- On Windows: Check system tray for Docker icon
- On Mac: Check menu bar for Docker icon
- Restart Docker Desktop if needed

#### **"Port already in use"**
**Solution:**
```bash
# Find what is using the port
# Windows PowerShell:
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3000
lsof -i :3001

# Kill the process or change ports in docker-compose.dev.yml
```

#### **"Container exits immediately"**
**Solution:**
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend

# Rebuild containers
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

---

### **2. Database Issues**

#### **"Database connection failed"**
**Solution:**
```bash
# Reset database completely
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up

# Check database is running
docker ps | grep postgres
```

#### **"Migrations failed"**
**Solution:**
```bash
# Run migrations manually
docker-compose -f docker-compose.dev.yml exec backend npm run db:migrate

# Or reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up
```

---

### **3. OpenAI API Issues**

#### **"OpenAI API key invalid"**
**Solution:**
1. Check your `.env` file exists in root directory
2. Verify key format: `OPENAI_API_KEY=sk-proj-...`
3. Get new key: https://platform.openai.com/api-keys
4. Restart containers after changing .env

#### **"Rate limit exceeded"**
**Solution:**
- You have hit OpenAI API limits
- Wait a few minutes or upgrade your OpenAI plan
- Check usage: https://platform.openai.com/usage

---

### **4. Frontend Issues**

#### **"Blank page / White screen"**
**Solution:**
```bash
# Check browser console for errors (F12)
# Check frontend logs
docker-compose -f docker-compose.dev.yml logs frontend

# Rebuild frontend
docker-compose -f docker-compose.dev.yml build frontend
docker-compose -f docker-compose.dev.yml up
```

#### **"API calls failing"**
**Solution:**
1. Check backend is running: http://localhost:3001/health
2. Check CORS settings in backend
3. Verify REACT_APP_API_URL in docker-compose.dev.yml

---

### **5. Backend Issues**

#### **"Module not found"**
**Solution:**
```bash
# Rebuild with fresh dependencies
docker-compose -f docker-compose.dev.yml build --no-cache backend
docker-compose -f docker-compose.dev.yml up
```

#### **"TypeScript compilation errors"**
**Solution:**
```bash
# Check backend logs
docker-compose -f docker-compose.dev.yml logs backend

# Fix TypeScript errors in code
# Then restart
docker-compose -f docker-compose.dev.yml restart backend
```

---

### **6. Windows-Specific Issues**

#### **"Line ending issues (CRLF vs LF)"**
**Solution:**
```bash
# Configure git to use LF
git config --global core.autocrlf false

# Re-clone repository
cd ..
rm -rf jobbuddy
git clone https://github.com/dannythehat/jobbuddy.git
```

#### **"Permission denied on scripts"**
**Solution:**
- Use Docker instead of running scripts directly
- Or use Git Bash / WSL2 instead of PowerShell

---

### **7. Mac-Specific Issues**

#### **"Docker slow on Mac"**
**Solution:**
1. Docker Desktop > Settings > Resources
2. Increase CPU and Memory allocation
3. Enable VirtioFS in Settings > General

---

### **8. Performance Issues**

#### **"App is slow"**
**Solution:**
```bash
# Check container resources
docker stats

# Increase Docker resources in Docker Desktop settings
# Recommended: 4GB RAM, 2 CPUs minimum
```

---

## 🆘 **Still Stuck?**

### **Get Help:**

1. **Check logs:**
```bash
docker-compose -f docker-compose.dev.yml logs
```

2. **Open GitHub Issue:**
- Go to: https://github.com/dannythehat/jobbuddy/issues
- Include:
  - Error message
  - OS and Docker version
  - Steps to reproduce
  - Relevant logs

3. **Quick Fixes:**
```bash
# Nuclear option - reset everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -a
docker-compose -f docker-compose.dev.yml up --build
```

---

## ✅ **Verification Checklist**

Before asking for help, verify:

- [ ] Docker Desktop is running
- [ ] `.env` file exists with valid OPENAI_API_KEY
- [ ] Ports 3000, 3001, 5432 are available
- [ ] You have internet connection
- [ ] Docker has enough resources (4GB RAM minimum)
- [ ] You are in the jobbuddy directory
- [ ] You ran `docker-compose -f docker-compose.dev.yml up`

---

## 📚 **Additional Resources**

- [Quick Start Guide](QUICKSTART.md)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
