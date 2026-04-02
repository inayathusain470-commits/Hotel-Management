# 🏨 Royal Plaza HMS - Deployment Guide

## ✅ Quick Deployment Checklist

### Step 1: Local Setup (Ek baar kar do)
```bash
# Backend dependencies install kar
cd backend
npm install

# Test locally
npm start
# Visit: http://localhost:5000/api/health
```

### Step 2: GitHub Push
```bash
cd ..  # Root folder se
git add .
git commit -m "Ready for deployment"
git push origin master
```

### Step 3: Railway Deploy (5 minutes)
1. Go to **railway.app**
2. Click **New Project**
3. Select **GitHub** → Choose `Hotel-Management` repo
4. Railway auto-detects and deploys 🚀

### Step 4: Add Environment Variables (Railway Dashboard)
```
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://vwjahaxogzccmpmofoow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[paste from .env]
SUPABASE_ANON_KEY=[paste from .env]
```

### Step 5: Update Frontend API URL
After deployment, update `js/script.js`:
```javascript
const API_BASE_URL = 'https://your-railway-url.railway.app/api';
```
Replace `your-railway-url` with real Railway domain from Dashboard.

---

## 📁 Project Structure

```
HMS/
├── Procfile                 ← Railway deployment config
├── package.json            ← Root dependencies
├── backend/
│   ├── package.json        ← Backend dependencies
│   ├── .env               ← Environment variables (DON'T PUSH)
│   └── src/
│       ├── server.js      ← Main Express server
│       └── routes/        ← API endpoints
├── js/
│   └── script.js          ← Frontend API client
└── [HTML files]           ← Frontend pages
```

---

## 🔑 Environment Variables Needed

**For Development (backend/.env):**
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://vwjahaxogzccmpmofoow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=sb_publishable_45kZV-gRzPfZqcWasujxIg...
```

**For Production (Railway Environment Variables):**
Same as above but Railway provides PORT automatically.

---

## 🚀 Deployment Status

| Environment | URL | Status |
|-------------|-----|--------|
| **Local** | http://localhost:5000 | ✅ Working |
| **Railway** | https://railway.app | ⏳ In Progress |
| **Frontend** | Deployed on Vercel/GitHub Pages | ⏳ Next |

---

## 🛠️ Troubleshooting

### Error: "Cannot find module dotenv"
✅ Already fixed - dotenv is in dependencies

### Error: "Command exited with non-zero code"
→ Check backend start script is correct
→ Verify package.json has `"start": "node src/server.js"`

### Error: "Port already in use"
→ Railway auto-assigns PORT
→ Use `process.env.PORT` (already doing this)

### API returns 404
→ Check frontend API URL is correct
→ Update `js/script.js` with Railway domain

---

## 📞 Support

If deployment fails:
1. Check Railway Deployments → Logs
2. Copy exact error message
3. Share here for quick fix

---

**Last Updated:** April 2, 2026
**Backend Status:** ✅ Production Ready
**Deployment Platform:** Railway.app
