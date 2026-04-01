# Email & SMS Setup Guide

## How to Enable Email and SMS Notifications

### 1. Email Setup (Gmail)

#### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification**

#### Step 2: Create App Password
1. In your Google Account, go to **Security**
2. Search for **App passwords** (should appear only if you have 2-step verification)
3. Select **Mail** and **Windows Computer**
4. Google will generate a 16-character password
5. Copy this password

#### Step 3: Update .env File
Edit `backend/.env` and add:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

**Example:**
```
EMAIL_USER=hotels@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

### 2. SMS Setup (Twilio - Optional)

#### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/console/phone-numbers/incoming
2. Create a free Twilio account
3. Verify your phone number

#### Step 2: Get Credentials
From your Twilio Dashboard:
1. Find your **Account SID**
2. Find your **Auth Token**
3. Get a **Twilio Phone Number** (e.g., +1234567890)

#### Step 3: Update .env File
```
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

### 3. Restart Backend

After updating `.env`:
```bash
cd backend
npm start
```

---

## What's Sent to Customers?

### ✅ Registration Welcome Email
- Personalized greeting
- Account details confirmation
- List of available services
- Support contact information

### ✅ Registration Welcome SMS
- Brief welcome message
- Link to support

### ✅ Booking Confirmation Email (Automatic)
- When customer books a room
- Booking ID and dates
- Room type and total price

---

## Testing Notifications

1. Open `login.html`
2. Register with:
   - Name: Test User
   - Email: your-email@gmail.com
   - Phone: +92XXXXXXXXXX (Pakistani format)
   - Password: Any password
3. Click **Register**
4. Check:
   - ✅ Email inbox (welcome email)
   - ✅ SMS to your phone (if Twilio configured)

---

## Troubleshooting

### Email not sending?
- Check that `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Verify 2-factor authentication is enabled on Gmail
- Check backend terminal for error messages

### SMS not sending?
- Verify Twilio credentials in `.env`
- Make sure phone number format is correct (include country code)
- In free Twilio, you can only send to verified numbers

### Check Backend Logs
```bash
# Terminal should show:
✅ Welcome email sent: 250 2.0.0 OK
✅ Welcome SMS sent: SM1234567890abcdef
```

---

## Hotel Configuration
Update in `backend/.env`:
```
HOTEL_NAME=Royal Plaza
HOTEL_SUPPORT_EMAIL=support@royalplaza.com
```

---

## Current Status
- ✅ Email service: Ready (needs Gmail setup)
- ✅ SMS service: Ready (needs Twilio setup)
- ✅ Automatic registration notifications: Enabled
- ✅ Can add booking notifications: Easy to implement
