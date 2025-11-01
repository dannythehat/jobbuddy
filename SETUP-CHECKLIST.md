# ✅ JobBuddy Setup Checklist

## 📋 **Before You Start**

- [ ] Docker Desktop installed and running
- [ ] OpenAI API key ready (get from: https://platform.openai.com/api-keys)
- [ ] Git installed
- [ ] Ports 3000, 3001, 5432 are free

---

## 🚀 **Setup Steps**

### **1. Get the Code**
```bash
git clone https://github.com/dannythehat/jobbuddy.git
cd jobbuddy
```
- [ ] Repository cloned
- [ ] Inside jobbuddy directory

### **2. Configure OpenAI**
```bash
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env
```
- [ ] .env file created
- [ ] OpenAI key added (starts with `sk-`)

### **3. Start Everything**
```bash
docker-compose -f docker-compose.dev.yml up
```
- [ ] Command running
- [ ] No errors in terminal
- [ ] See "Compiled successfully!" message

### **4. Verify It Works**
- [ ] Open http://localhost:3000 (frontend loads)
- [ ] Open http://localhost:3001/health (shows "OK")
- [ ] Can register a new account
- [ ] Can login successfully

---

## ✅ **Success Indicators**

You should see in terminal:
```
✓ postgres    | database system is ready to accept connections
✓ backend     | Server running on port 3001
✓ frontend    | Compiled successfully!
✓ frontend    | webpack compiled successfully
```

Browser should show:
- JobBuddy login page at http://localhost:3000
- No console errors (press F12 to check)

---

## 🔧 **If Something Fails**

### **Docker not running?**
- Start Docker Desktop
- Wait for it to fully start (icon turns green)
- Try again

### **Port already in use?**
```bash
# Stop everything
docker-compose -f docker-compose.dev.yml down

# Try again
docker-compose -f docker-compose.dev.yml up
```

### **Still stuck?**
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Open issue on GitHub with error message
3. Include your OS and Docker version

---

## 🎯 **After Setup Works**

Once everything is running:

- [ ] Upload a CV in the CVs page
- [ ] Try searching for jobs
- [ ] Test the natural language search
- [ ] Explore the dashboard

---

## 📝 **Next Development Steps**

After confirming local setup works:

1. **Phase 6.1** - Complete NL search frontend
2. **Mobile UI** - Fix responsive design issues
3. **GCP Deployment** - Deploy to production (optional)

---

## 🆘 **Need Help?**

- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **GitHub Issues:** https://github.com/dannythehat/jobbuddy/issues
- **Latest Setup Issue:** [#29](https://github.com/dannythehat/jobbuddy/issues/29)

---

## 💡 **Pro Tips**

**Stop containers:**
```bash
docker-compose -f docker-compose.dev.yml down
```

**View logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

**Rebuild after code changes:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Reset database:**
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up
```
