# HMS Backend - Payment Profile Setup

## Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```

The server will run on `http://localhost:5000`

### 2. Payment Profile API Endpoints

**GET /api/payment-profile**
- Fetches current payment profile from database
- Response includes: `account_holder`, `upi_id`, `bank_name`, `account_number`, `ifsc`, `support_phone`

**PUT /api/payment-profile**
- Updates or creates payment profile
- Required fields: `accountHolder`, `upiId`, `bankName`, `accountNumber`, `ifsc`
- Optional: `supportPhone`

### 3. Current Payment Details (Kotak Bank - Inayat Husain)

All payment pages now fetch these details from the backend API:
- **Account Holder**: INAYAT HUSAIN
- **UPI ID**: 9044089140@kotak811
- **Bank**: Kotak Bank
- **Account Number**: 5450882039
- **IFSC**: KKBK0005633
- **Support Phone**: +91-9044089140

### 4. How It Works

1. **Frontend pages** (booking.html, my_cart.html, rooms.html, admin_payment_settings.html) now:
   - Fetch payment profile from `/api/payment-profile` when needed
   - Fall back to localStorage if API is unavailable
   - This ensures consistent payment details across all devices

2. **Admin payment settings page**:
   - Saves changes to both backend API and localStorage for redundancy
   - Displays real-time QR code preview
   - Validates UPI format before saving

3. **Database (Supabase)**:
   - `payment_profile` table stores one record with payment details
   - Table structure: `account_holder`, `upi_id`, `bank_name`, `account_number`, `ifsc`, `support_phone`, `custom_qr_image`, `created_at`, `updated_at`

### 5. Testing the API

```bash
# Test GET (fetch payment profile)
curl http://localhost:5000/api/payment-profile

# Test PUT (update payment profile)
curl -X PUT http://localhost:5000/api/payment-profile \
  -H "Content-Type: application/json" \
  -d '{
    "accountHolder": "INAYAT HUSAIN",
    "upiId": "9044089140@kotak811",
    "bankName": "Kotak Bank",
    "accountNumber": "5450882039",
    "ifsc": "KKBK0005633",
    "supportPhone": "+91-9044089140"
  }'
```

### 6. Multi-Device Sync

✅ Now fully synchronized! When backend is running:
- Customer books room on phone → Uses UPI details from backend API
- Different customer orders food on laptop → Gets same UPI details from backend API
- Admin updates payment settings on desktop → Saved to backend DB and synced automatically
- All devices show the same payment details and QR code

### 7. Fallback Mechanism

If backend API is not available:
- Frontend falls back to localStorage
- Still works but each device has separate payment history
- Once backend is restored, API takes priority again

---

**Setup Status**: ✅ Ready to use
**Database**: Supabase PostgreSQL
**Payment Account**: INAYAT HUSAIN / Kotak Bank
**API Port**: 5000
