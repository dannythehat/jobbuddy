# 🚀 JobBuddy - Quick Start (NO SCRIPTS NEEDED!)

## ⚡ **ONE-COMMAND SETUP**

### **Prerequisites**
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### **Step 1: Clone & Configure**

```bash
# Clone the repo
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy

# Create .env file for OpenAI key
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env
```

### **Step 2: Start Everything**

```bash
docker-compose -f docker-compose.dev.yml up
```

**That's it!** 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: PostgreSQL on port 5432

### **Step 3: Stop Everything**

```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 🔧 **Troubleshooting**

### **"Port already in use"**
```bash
# Stop conflicting services
docker-compose -f docker-compose.dev.yml down
# Or change ports in docker-compose.dev.yml
```

### **"OpenAI API error"**
- Make sure you added your real API key to `.env`
- Format: `OPENAI_API_KEY=sk-proj-...`

### **"Database connection failed"**
```bash
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up
```

### **"npm install errors"**
```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

---

## 📝 **What Gets Created**

- ✅ PostgreSQL database (auto-configured)
- ✅ Redis cache (auto-configured)
- ✅ Backend API (auto-starts)
- ✅ Frontend app (auto-starts)
- ✅ All dependencies installed automatically

---

## 🎯 **Next Steps**

1. **Register an account** at http://localhost:3000
2. **Upload your CV** in the CVs page
3. **Search for jobs** using natural language
4. **Apply to jobs** with AI-generated applications

---

## 🆘 **Still Stuck?**

Open an issue with:
1. Your error message
2. Your OS (Windows/Mac/Linux)
3. Docker version: `docker --version`

---

## 🚀 **Production Deployment**

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for GCP deployment instructions.

---

## 📚 **Documentation**

- [API Documentation](docs/api.md)
- [Architecture](docs/architecture.md)
- [Features](docs/features.md)
- [Contributing](docs/contributing.md)
