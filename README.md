# 🏨 Royal Plaza Hotel Management System

> A complete hotel management platform with room bookings, bar services, food orders, and admin dashboard.

---

## ⚡ Quick Start (5 minutes)

### 1. Start Backend Locally
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### 2. Open Frontend
Open `index.html` in browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Or Node.js
npx http-server
```
Frontend runs on: `http://localhost:8000`

### 3. Test Login
- **Admin**: admin@hotel.com / password
- **Staff**: staff@hotel.com / password  
- **Customer**: Register from login page

---

## 🚀 Deploy to Railway (Production)

### Step 1: Prepare
```bash
cd HMS
npm install  # Install root deps
cd backend
npm install  # Install backend deps
```

### Step 2: Test Locally
```bash
npm start
# Check: http://localhost:5000/api/health
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin master
```

### Step 4: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. New Project → GitHub
3. Select `Hotel-Management` repo
4. Railway auto-detects and deploys 🚀

### Step 5: Add Environment Variables (Railway Dashboard)
```
# Required:
PORT=3000 (auto)
NODE_ENV=production
SUPABASE_URL=https://vwjahaxogzccmpmofoow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=sb_publishable...

# Optional (for email/SMS):
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app-password
```

### Step 6: Update Frontend API URL
Edit `js/script.js` line 229:
```javascript
// Change from:
const API_BASE_URL = 'http://localhost:5000/api';

// To:
const API_BASE_URL = 'https://your-railway-hash.railway.app/api';
```

Get your Railway URL from: Railway Dashboard → Domain

---

## 📁 Project Structure

```
HMS/
├── 📄 Procfile              ← Railway config
├── 📄 package.json          ← Root dependencies
├── 📄 DEPLOYMENT_GUIDE.md   ← Detailed deployment steps
├── 📄 ENV_TEMPLATE.md       ← Environment variables
│
├── 🔧 backend/
│   ├── package.json         ← Backend dependencies
│   ├── .env                 ← Secrets (DON'T PUSH!)
│   └── src/
│       ├── server.js        ← Express main server
│       ├── db.js            ← Supabase connection
│       └── routes/          ← 12 API endpoints
│           ├── customers.js
│           ├── bookings.js
│           ├── bar-bookings.js
│           ├── food-orders.js
│           ├── analytics.js
│           └── [more...]
│
├── 🎨 Frontend Files
│   ├── index.html           ← Landing page
│   ├── home.html
│   ├── admin_dashboard.html
│   ├── rooms.html
│   ├── booking.html
│   └── [+13 more pages]
│
├── 💾 Database Files
│   ├── css/style.css        ← All styling
│   ├── js/script.js         ← Frontend utilities + API client
│   └── images/              ← Hotel images (38+)
```

---

## 🔐 Security

### Environment Variables (.env)
```bash
# NEVER commit these to Git!
# Create: backend/.env with these values
PORT=5000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### .gitignore
```
backend/.env
node_modules/
.env
```

---

## 📊 Database (Supabase)

**URL:** https://vwjahaxogzccmpmofoow.supabase.co

**Tables:**
- `customers` - User accounts
- `bookings` - Room reservations
- `bar_bookings` - Bar service bookings
- `food_orders` - Food orders
- `contacts` - Contact form submissions
- `reviews` - User reviews
- `analytics` - Dashboard metrics
- `payment_profiles` - Payment info
- `coupons` - Discount codes
- `notifications` - Email/SMS logs
- `messages` - User messages

**Connection:**
- Language: PostgreSQL
- Library: `@supabase/supabase-js`

---

## 🔗 API Endpoints (12 Total)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/customers/register` | POST | Create account + send email/SMS |
| `/api/customers/login` | POST | Authenticate user |
| `/api/bookings` | GET/POST | Room bookings |
| `/api/bar-bookings` | GET/POST | Bar services |
| `/api/food-orders` | GET/POST | Food orders |
| `/api/contacts` | GET/POST | Contact submissions |
| `/api/analytics` | GET | Dashboard stats |
| `/api/reviews` | GET/POST | User reviews |
| `/api/coupons` | GET | Discount codes |
| `/api/notifications` | GET/POST | Email/SMS logs |
| `/api/payment-profile` | GET/PUT | Payment settings |

---

## 💬 Features

### Customer
✅ Register & Login
✅ View rooms & book
✅ Bar service booking
✅ Food ordering
✅ Dashboard with bookings
✅ Profile management

### Admin
✅ Dashboard with analytics
✅ View all bookings
✅ Manage users
✅ View food orders
✅ Generate reports
✅ Revenue tracking

### Notifications
✅ Welcome email on registration
✅ Welcome SMS (optional)
✅ Booking confirmations
✅ Order updates

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- IndexedDB for offline data
- LocalStorage for preferences
- Responsive design (mobile-first)

**Backend:**
- Node.js + Express.js
- Supabase PostgreSQL
- Nodemailer (Email)
- Twilio/Jazz (SMS)
- CORS enabled for frontend

**Hosting:**
- Railway (Backend)
- Vercel/GitHub Pages (Frontend)
- Supabase (Database)

---

## 📱 Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: < 480px

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process and restart
npm start
```

### API returns 404
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Verify frontend API URL is correct
# Edit: js/script.js line 229
```

### Deployment fails on Railway
1. Check Logs: Railway Dashboard → Deployments → Logs
2. Verify: Procfile is in root directory
3. Check: package.json has postinstall script
4. Ensure: backend/package.json exists

### Database connection error
```bash
# Verify Supabase credentials in backend/.env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📞 Support & Contact

**Issues?**
1. Check DEPLOYMENT_GUIDE.md
2. Review ENV_TEMPLATE.md
3. Check Railway logs
4. Verify environment variables

**Development:**
- Backend Port: 5000
- Frontend Port: 8000
- Database: Supabase PostgreSQL

---

## 📜 Quick Commands

```bash
# Local Development
cd backend && npm start           # Start backend
npm run dev                       # Frontend dev server
npm install                       # Install deps

# Deployment
git push origin master            # Push to GitHub
railway logs                      # Check Railway logs
curl https://your-url/api/health # Test production

# Testing
curl http://localhost:5000/api/bookings      # Get bookings
curl http://localhost:5000/api/health -I     # Check health
```

---

**Created:** April 2, 2026
**Status:** ✅ Production Ready
**Last Updated:** April 2, 2026
