# ⚠️ RAILWAY VARIABLES - DO THIS EXACTLY

## Current Status:
```
✅ Local Backend: WORKING (port 5000)
✅ Code on GitHub: PUSHED
❌ Railway: MISSING ENVIRONMENT VARIABLES
```

## Solution (5 Minutes):

### STEP 1: Browser Tab
Open: **https://railway.app/dashboard**

### STEP 2: Click Project
Look for: **"HMS"** or **"Hotel-Management"**
Click it.

### STEP 3: Find Variables
You'll see tabs:
- Deployments
- Logs  
- **Variables** ← Click This One

### STEP 4: Add Variable #1
Click: **"New Variable"** button (usually green or blue)

Input Field 1 (Name): **SUPABASE_URL**
Input Field 2 (Value): 
```
https://vwjahaxogzccmpmofoow.supabase.co
```

Click: **Save** or **Add** button

### STEP 5: Add Variable #2
Click: **"New Variable"** button again

Input Field 1 (Name): **SUPABASE_SERVICE_ROLE_KEY**
Input Field 2 (Value): (Long key, copy exactly)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3amFoYXhvZ3pjY21wbW9mb293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3NzE3MywiZXhwIjoyMDkwNDUzMTczfQ.S6B1Rr4f_2geBw93xOGX-hkZPjWU7xKx-uYv_-KIQtk
```

Click: **Save** or **Add** button

### STEP 6: Add Variable #3
Click: **"New Variable"** button again

Input Field 1 (Name): **SUPABASE_ANON_KEY**
Input Field 2 (Value):
```
sb_publishable_45kZV-gRzPfZqcWasujxIg_Za79trb_eL1ohjTKNx4
```

Click: **Save** or **Add** button

### STEP 7: Add Variable #4
Click: **"New Variable"** button again

Input Field 1 (Name): **NODE_ENV**
Input Field 2 (Value):
```
production
```

Click: **Save** or **Add** button

### STEP 8: Redeploy
Click: **Deployments** tab (back to deployments)

Find: Red/failed deployment (at bottom, usually latest)

Click: Three dots **...** menu

Select: **Redeploy**

### STEP 9: Wait & Check
Wait: **60 seconds**

Click: **Logs** tab

Scroll: To bottom

Look for: 
```
✅ Supabase connected: https://vwjahaxogzccmpmofoow.supabase.co
```

Or:
```
HMS backend running on 0.0.0.0:3000
```

---

## ✅ When You See Those Logs = YOU'RE DONE! 

Backend is now live on Railway! 🚀

---

## Next: Update Frontend

In your editor, open: `js/script.js`

Find line: 229 (or search for `API_BASE_URL`)

Change from:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

To (get URL from Railway Domain):
```javascript
const API_BASE_URL = 'https://your-railway-domain.railway.app/api';
```

---

## How to Get Railway Domain URL:

In Railway Dashboard:
1. Click your project (HMS)
2. Look for **"Domain"** section
3. You'll see: `https://something-something.railway.app`
4. Copy that

---

## 🔴 COMMON MISTAKES:

❌ Don't copy-paste without triple-checking
❌ Don't forget to click "Add" after each variable
❌ Don't forget to Redeploy
❌ Don't use wrong values

✅ Do follow each step exactly
✅ Do wait 60 seconds for redeploy
✅ Do check logs for success message
✅ Do update frontend API URL after

---

## Status After This:

```
✅ Backend running on Railway
✅ Connected to Supabase
✅ All API routes working
✅ Ready for frontend to call
```

---

**GO DO THIS NOW! Report back when done!** 🚀
