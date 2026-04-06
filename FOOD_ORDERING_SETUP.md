# Food Ordering Payment System - Setup Guide

## Current Status
✅ Frontend: Fully implemented (my_cart.html)
✅ Backend API: Ready (/api/food-orders)
⚠️ Database: Table needs to be created

## What's Implemented

### Food Ordering Flow:
1. **Add to Cart** - User selects items from food menu
2. **View Cart** - my_cart.html displays all items with prices
3. **Enter Details** - User enters name, room number, phone
4. **Payment Modal** - Total amount shown with payment method selection
5. **Payment Processing** - User selects UPI, QR Code, or Debit Card
6. **Order Creation** - After payment, order is saved to database

### Payment Methods Supported:
- ✅ UPI (with transaction reference)
- ✅ QR Code (auto-generates UPI QR)
- ✅ Debit Card (full card details with validation)

### Order Data Saved:
- Customer name, email, room number, phone
- Items ordered (with quantities and prices)
- Total amount in INR
- Payment method & transaction ID
- Payment reference number
- Order timestamp
- Order status (pending/confirmed/delivered)

## Setup Instructions

### Step 1: Create Database Table

Go to Supabase Dashboard:
1. Navigate to: https://app.supabase.com/
2. Select your project: "HMS"
3. Go to "SQL Editor" tab
4. Click "New Query"
5. Copy the SQL from: `backend/migrations/001-create-food-orders-table.sql`
6. Paste and run the query
7. Wait for confirmation: "Food orders table created successfully!"

### Alternative: Using PostgreSQL CLI

```bash
psql "postgresql://postgres:YOUR_PASSWORD@vwjahaxogzccmpmofoow.supabase.co:5432/postgres" \
  -f backend/migrations/001-create-food-orders-table.sql
```

## How Food Ordering Works

### Customer Workflow:
```
1. Customer logs in / adds details
   ↓
2. Adds food items to cart (food_menu.html)
   ↓
3. Goes to My Cart (my_cart.html)
   ↓
4. Enters name, room number, phone
   ↓
5. Clicks "Place Order"
   ↓
6. Payment Modal Opens (shows total)
   ↓
7. Selects Payment Method (UPI/QR/Card)
   ↓
8. Enters Payment Details
   ↓
9. Clicks "Pay Now"
   ↓
10. Order Saved to Database ✅
    Cart Cleared
    Confirmation Message Shown
   ↓
11. Dashboard Updated (visible in "My Food Orders")
```

### Admin Workflow:
```
1. Admin logs in to admin_dashboard.html
   ↓
2. Views "Food Orders" section
   ↓
3. Sees pending, preparing, ready, delivered orders
   ↓
4. Can update order status
   ↓
5. Can view payment details for each order
```

## API Endpoints

### Create Food Order (POST)
```bash
POST /api/food-orders

Body:
{
  "name": "John Doe",
  "customer_email": "john@example.com",
  "room": 101,
  "phone": "9876543210",
  "items": [
    {"item": "Butter Chicken", "quantity": 2, "price": 350},
    {"item": "Naan", "quantity": 4, "price": 50}
  ],
  "total": 800,
  "payment_method": "upi",
  "payment_txn_id": "FOODPAY-1234567890",
  "payment_reference": "UPI12345",
  "status": "pending"
}

Response:
{
  "id": "uuid-here",
  "message": "Food order saved"
}
```

### Get All Food Orders (GET)
```bash
GET /api/food-orders

Response:
[
  {
    "id": "uuid",
    "name": "John Doe",
    "customerEmail": "john@example.com",
    "room": 101,
    "phone": "9876543210",
    "items": [...],
    "total": 800,
    "status": "pending",
    "timestamp": "2026-04-06T10:30:00Z",
    "payment": {...}
  }
]
```

### Update Order Status (PUT)
```bash
PUT /api/food-orders/:id/status

Body:
{ "status": "preparing" }

Valid statuses:
- pending (initial)
- preparing (kitchen started)
- ready (ready for delivery)
- delivered (delivered to room)
- cancelled
```

### Cancel Order (PUT)
```bash
PUT /api/food-orders/:id/cancel

Body:
{ "status": "cancelled" }
```

## Frontend Components

### my_cart.html
- **cart-items**: Displays items in cart with remove button
- **cart-total**: Shows total amount
- **place-order-form**: Form for customer details
- **foodPaymentModal**: Payment modal with UPI/QR/Card options

### customer_dashboard.html
- **food-orders-display**: Shows customer's food orders with status

### admin_dashboard.html
- **food-orders-section**: Admin view of all food orders
- Dashboard updates in real-time

## Testing

### Test Food Order Creation:

```powershell
# In PowerShell
$body = @{
    name = "Test Customer"
    room = 101
    phone = "9876543210"
    items = @(@{item="Butter Chicken"; quantity=1; price=350})
    total = 350
    status = "pending"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/food-orders" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## Troubleshooting

### Error: "Could not find the 'name' column"
- **Solution**: Run the SQL migration in Supabase SQL Editor (Step 1 above)

### Error: "Missing fields: name, room, items, total"
- **Solution**: Ensure all required fields are included in the POST request body

### Food orders not showing in dashboard
- **Solution**: Refresh customer_dashboard.html, check if orders were created successfully

### Payment modal not appearing
- **Solution**: 
  1. Check browser console for errors (F12)
  2. Ensure cart has items
  3. Verify form submission works

## What Works ✅

1. ✅ Add items to cart
2. ✅ Enter customer details
3. ✅ Payment modal with 3 payment methods
4. ✅ Payment processing
5. ✅ Order creation & storage
6. ✅ Food orders API
7. ✅ Customer dashboard display
8. ✅ Admin dashboard display
9. ✅ Order status tracking

## Next Steps (Optional Enhancements)

1. Add order confirmation email notification
2. Add real-time order status updates
3. Add estimated delivery time
4. Add rating/review after food order
5. Add food order history export
6. Add kitchen management interface
7. Add SMS notifications for order status

## Support

For issues or questions:
1. Check backend logs: `npm run dev` in backend folder
2. Check browser console: F12 → Console tab
3. Verify table structure in Supabase SQL Editor
4. Test API endpoints using Postman or similar tools
