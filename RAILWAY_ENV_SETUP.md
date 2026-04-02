# 🚀 Railway Environment Variables Setup

## ⚠️ Current Error:
```
Missing Supabase credentials in .env file
```

This happens because **Railway doesn't read .env files** - it needs environment variables set in the Dashboard.

---

## ✅ Solution: Add Variables to Railway Dashboard

### Step-by-Step:

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login with GitHub

2. **Select HMS Project**
   - Click on "Royal Plaza HMS"
   - Or "Hotel-Management" project

3. **Click "Variables" Tab**
   - You should see a tab next to "Deployments"

4. **Add These Variables:**

```
SUPABASE_URL = https://vwjahaxogzccmpmofoow.supabase.co

SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3amFoYXhvZ3pjY21wbW9mb293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3NzE3MywiZXhwIjoyMDkwNDUzMTczfQ.S6B1Rr4f_2geBw93xOGX-hkZPjWU7xKx-uYv_-KIQtk

SUPABASE_ANON_KEY = sb_publishable_45kZV-gRzPfZqcWasujxIg_Za79trb_eL1ohjTKNx4

NODE_ENV = production

CORS_ORIGIN = *
```

⚠️ **Important:** Never expose service role key in frontend! Only use in backend.

---

## 🔧 Optional Variables (for Email/SMS)

If you want email/SMS notifications to work in production:

```
# Email (Gmail)
EMAIL_SERVICE = gmail
EMAIL_USER = your-email@gmail.com
EMAIL_PASSWORD = your-app-password

# SMS (choose one)
SMS_PROVIDER = jazz
JAZZ_API_KEY = your-api-key
JAZZ_SENDER_ID = RoyalPlaza

# OR Twilio
TWILIO_ACCOUNT_SID = your-sid
TWILIO_AUTH_TOKEN = your-token
TWILIO_PHONE_NUMBER = +1234567890
```

---

## 📝 How to Get Values

### SUPABASE_URL & Keys:
```bash
# Option 1: From Supabase Dashboard
1. Go to: https://supabase.com
2. Login
3. Select "Royal Plaza" project
4. Settings → API
5. Copy: Project URL and Service Role Key

# Option 2: From backend/.env (locally)
cat backend/.env | grep SUPABASE
```

### EMAIL_PASSWORD (Gmail):
```
1. Go to: https://myaccount.google.com/apppasswords
2. Select App: Mail
3. Select Device: Windows (or your OS)
4. Get 16-character password
5. Use this as EMAIL_PASSWORD (not your Gmail password!)
```

---

## ✅ Verify Setup

After adding variables:

1. **Trigger Redeploy:**
   - Go to Railway → Deployments
   - Click "Redeploy" button
   - Or push new commit to GitHub

2. **Check Logs:**
   - Railway → Logs
   - Should show: `✅ Supabase connected: https://...`

3. **Test API:**
   ```bash
   curl https://your-railway-url.railway.app/api/health
   
   # Should return:
   # {"ok":true,"service":"hms-backend",...}
   ```

---

## 🐛 Still Getting Error?

#### Error 1: "Missing Supabase credentials"
→ Variables not saved in Railway Dashboard
→ Check: Variables tab in Railway project
→ Try: Redeploy after adding variables

#### Error 2: "Invalid credentials"
→ Values are wrong or expired
→ Check: Copy-paste exactly from .env
→ Try: Verify keys in Supabase dashboard

#### Error 3: "Connection refused"
→ Railway server didn't start
→ Check: Railway Logs for errors
→ Try: Manually redeploy from Dashboard

---

## 🔄 Local Development vs Production

### Local (.env file in backend/)
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Production (Railway Dashboard Variables)
```
Same variables but:
- PORT is auto-assigned (usually 3000/8000)
- NODE_ENV=production
```

⚠️ **Never commit .env to Git!** It stays local only.

---

## 📋 Quick Checklist

- [ ] Pushed code to GitHub (master branch)
- [ ] Railway detects GitHub repo
- [ ] Added SUPABASE_URL variable
- [ ] Added SUPABASE_SERVICE_ROLE_KEY variable
- [ ] Added SUPABASE_ANON_KEY variable
- [ ] Clicked Redeploy in Railway
- [ ] Check logs show "✅ Supabase connected"
- [ ] Health check responds: `curl https://your-url/api/health`
- [ ] Updated frontend API URL in js/script.js

---

## 🚀 After Variables Are Set

Your backend will:
1. ✅ Connect to Supabase
2. ✅ All API endpoints working
3. ✅ Database queries possible
4. ✅ Email/SMS (if configured)

Then update frontend:
```javascript
// Edit: js/script.js (line ~229)
const API_BASE_URL = 'https://your-railway-url.railway.app/api';
```

---

**Created:** April 2, 2026
**Updated:** When Node.js 20 requirement added
