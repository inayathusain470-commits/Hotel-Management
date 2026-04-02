# 🚀 RAILWAY ENVIRONMENT VARIABLES - EXACT STEPS

## ⚠️ Error You're Getting:
```
Missing Supabase credentials. See error messages above.
```

## ✅ Why This Happens:
Railway doesn't read .env files. It needs variables set in Dashboard.

---

## 🔧 EXACT STEPS TO FIX (Follow Carefully):

### Step 1: Open Railway Dashboard
```
Go to: https://railway.app
Login with GitHub
```

### Step 2: Select Your Project
```
Click: "HMS" or "Hotel-Management" project
```

### Step 3: Click "Variables" Tab
```
You'll see:
- Deployments (tab)
- Logs (tab)
- Variables ← CLICK THIS
```

### Step 4: Add First Variable

**Click "New Variable" button**

**Name:** `SUPABASE_URL`

**Value:** (Copy exactly)
```
https://vwjahaxogzccmpmofoow.supabase.co
```

**Click Save/Add**

---

### Step 5: Add Second Variable

**Click "New Variable" button**

**Name:** `SUPABASE_SERVICE_ROLE_KEY`

**Value:** (Copy exactly, it's LONG)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3amFoYXhvZ3pjY21wbW9mb293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3NzE3MywiZXhwIjoyMDkwNDUzMTczfQ.S6B1Rr4f_2geBw93xOGX-hkZPjWU7xKx-uYv_-KIQtk
```

**Click Save/Add**

---

### Step 6: Add Third Variable

**Click "New Variable" button**

**Name:** `SUPABASE_ANON_KEY`

**Value:** (Copy exactly)
```
sb_publishable_45kZV-gRzPfZqcWasujxIg_Za79trb_eL1ohjTKNx4
```

**Click Save/Add**

---

### Step 7: Add Fourth Variable

**Click "New Variable" button**

**Name:** `NODE_ENV`

**Value:**
```
production
```

**Click Save/Add**

---

### Step 8: Redeploy

**Go to Deployments tab**

**Find latest red/failed deployment**

**Click "Redeploy" button**

OR

**Push new commit to GitHub:**
```powershell
cd HMS
git add .
git commit -m "Railway: add environment variables"
git push origin master
```

---

### Step 9: Check Logs

**Click Logs tab**

**Wait 30-60 seconds**

**Look for this message:**
```
✅ Supabase connected: https://vwjahaxogzccmpmofoow.supabase.co
```

**OR this (shows it's working):**
```
HMS backend running on 0.0.0.0:3000
Database: Supabase PostgreSQL
Environment: production
```

---

## ✅ How It Should Look

### In Railway Variables Tab:
```
┌─ Variable 1 ───────────────────────────────┐
│ SUPABASE_URL                               │
│ https://vwjahaxogzccmpmofoow.supabase.co  │
└────────────────────────────────────────────┘

┌─ Variable 2 ───────────────────────────────┐
│ SUPABASE_SERVICE_ROLE_KEY                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...         │
└────────────────────────────────────────────┘

┌─ Variable 3 ───────────────────────────────┐
│ SUPABASE_ANON_KEY                          │
│ sb_publishable_45kZV-g...                 │
└────────────────────────────────────────────┘

┌─ Variable 4 ───────────────────────────────┐
│ NODE_ENV                                   │
│ production                                 │
└────────────────────────────────────────────┘
```

---

## 🧪 Test If It's Working

After deployment (look for green checkmark):

```powershell
# Replace YOUR-RAILWAY-URL with actual URL from Railway domain
curl https://YOUR-RAILWAY-URL.railway.app/api/health

# Should return:
# {"ok":true,"service":"hms-backend",...}
```

---

## 🐛 If Still Not Working

### Check 1: Verify Variables Are Saved
- Go to Railway Variables tab
- Confirm all 4 variables visible
- Make sure no empty fields

### Check 2: Check Redeploy Status
- Go to Deployments
- Look for green checkmark ✅
- Red X ❌ means deployment failed

### Check 3: Read Error Logs
- Click Deployments → Logs
- Scroll down
- Copy exact error message
- Share with me

### Check 4: Try Manual Redeploy
- Deployments → Find latest failed
- Click menu (...) → Redeploy
- Wait 60 seconds
- Check logs again

---

## 📱 Screenshot Guide

### What to look for in Railway:

1. **Top bar:** Shows project name "HMS"
2. **Tabs below:** Deployments | Logs | **Variables** ← Click here
3. **Variables section:** Shows list of env vars
4. **Add button:** Usually green "New Variable" or "+" button

---

## 🔐 Important Notes

⚠️ **These are PRODUCTION credentials - keep SECRET!**
- Never share SUPABASE_SERVICE_ROLE_KEY publicly
- Only use in backend (Railway), never in frontend
- Railway keeps them encrypted

✅ **Safe to use:**
- SUPABASE_URL (public, visible)
- SUPABASE_ANON_KEY (public, for frontend)
- NODE_ENV (always public)

---

## ✅ Final Checklist

- [ ] Opened https://railway.app
- [ ] Selected HMS project
- [ ] Clicked Variables tab
- [ ] Added SUPABASE_URL (with correct value)
- [ ] Added SUPABASE_SERVICE_ROLE_KEY (long token)
- [ ] Added SUPABASE_ANON_KEY (with correct key)
- [ ] Added NODE_ENV = production
- [ ] Clicked Redeploy or Pushed to GitHub
- [ ] Waited 60 seconds for deployment
- [ ] Checked Logs for "✅ Supabase connected"
- [ ] Tested with curl command

---

**If you're stuck on any step, let me know which step number!**
