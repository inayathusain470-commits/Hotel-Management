# HMS Backend - Supabase PostgreSQL Edition

## Prerequisites

- Node.js (v14 or higher)
- Supabase Account (free at https://supabase.com)

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com
2. Project Settings → API
3. Copy:
   - Project URL (`SUPABASE_URL`)
   - `anon` key (`SUPABASE_ANON_KEY`)
   - `service_role` key (`SUPABASE_SERVICE_ROLE_KEY`)

### 2. Configure Environment

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` with your Supabase credentials:
```
PORT=5000
CORS_ORIGIN=*
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc7...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc7...
```

### 3. Create Database Tables

1. Go to Supabase → SQL Editor
2. Open `backend/database/schema-supabase.sql`
3. Copy entire content into SQL Editor
4. Click "Run"

Or manually create tables using:
[schema-supabase.sql](database/schema-supabase.sql)

### 4. Start Backend

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

- **Health**: `GET /api/health`
- **Customers**: `/api/customers` (register, login, list)
- **Bookings**: `/api/bookings` (create, list)
- **Bar Bookings**: `/api/bar-bookings` (create, list)
- **Food Orders**: `/api/food-orders` (create, list, update status)
- **Contacts**: `/api/contacts` (create, list)
- **Payment Profile**: `/api/payment-profile` (get, update)

## Database Tables

- `customers` - Customer accounts and login
- `bookings` - Room bookings with payment info
- `bar_bookings` - Bar/event bookings
- `food_orders` - Food orders with delivery status
- `contacts` - Contact form submissions
- `payment_profile` - Admin payment settings (UPI, Bank account)

## View Data in Supabase

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run queries:
```sql
SELECT * FROM customers;
SELECT * FROM bookings;
SELECT * FROM food_orders WHERE status = 'pending';
```

Or use Supabase Studio's Table browser.

## Troubleshooting

### Service Role Key Missing
- Go to Settings → API → Copy `service_role` key
- Add to `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Connection Error
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Check internet connection
- Ensure Supabase project is active

### Tables Not Created
- Go to Supabase SQL Editor
- Run schema from `database/schema-supabase.sql`
- Wait for completion message

## Features

✅ PostgreSQL database (reliable, scalable)
✅ Zero setup - Supabase handles hosting
✅ Real-time subscriptions (if needed)
✅ Built-in authentication (optional)
✅ File storage (if needed)
✅ Free tier available

Tables included:

- `customers`
- `bookings`
- `bar_bookings`
- `food_orders`
- `contacts`
- `admin_payment_profile`

## 4. API structure

- `GET /api/health`
- `POST /api/customers/register`
- `POST /api/customers/login`
- `GET /api/customers`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bar-bookings`
- `POST /api/bar-bookings`
- `GET /api/food-orders`
- `POST /api/food-orders`
- `GET /api/contacts`
- `POST /api/contacts`
- `GET /api/payment-profile`
- `PUT /api/payment-profile`

## 5. Frontend integration note

Your current frontend still uses localStorage heavily. This backend is ready for migration page-by-page.
A typical API base URL will be:

- `http://localhost:5000/api`

If you want, next step can be full migration of login, booking, food, and dashboard pages from localStorage to backend APIs.
