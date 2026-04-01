# SMS Configuration Guide - Pakistan Focus

## 3 Options to Send SMS (Choose One)

---

## Option 1: Jazz/Mobilink SMS API (Best for Pakistan 🇵🇰)

### Fastest Setup - Free Tier Available

**Requirements:**
- Jazz business account
- API Key from Jazz developer portal

**Setup:**
1. Go to: https://developer.jazzweb.pk
2. Register business account
3. Generate API Key
4. Update `backend/.env`:

```
SMS_PROVIDER=jazz
JAZZ_API_URL=https://api.jazzweb.pk/v2/SendSMS
JAZZ_API_KEY=your-jazz-api-key-here
JAZZ_SENDER_ID=RoyalPlaza
```

**Cost:** Free tier available (limited SMS/month)

---

## Option 2: Zong SMS API (Pakistan)

### Alternative Pakistani Provider

1. Go to: https://developer.zong.com.pk
2. Create account → Get API credentials
3. Update `backend/.env`:

```
SMS_PROVIDER=http
SMS_GATEWAY_URL=https://zong-api-url/send
SMS_GATEWAY_APIKEY=your-zong-api-key
SMS_SENDER_ID=RoyalPlaza
```

**Cost:** Pay per SMS (very cheap)

---

## Option 3: Twilio (International - Paid)

### Works globally but costs money

1. Go to: https://www.twilio.com
2. Create account → Add payment method
3. Get:
   - Account SID (starts with AC...)
   - Auth Token
   - Twilio Phone Number
4. Update `backend/.env`:

```
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

**Cost:** ~Rs. 0.80-2 per SMS

---

## Current Status

✅ Email working (update Gmail credentials)
❌ SMS not configured (placeholder values)

---

## How to Enable SMS

### Step 1: Choose Provider
- **Pakistan users**: Jazz or Zong (recommended)
- **International**: Twilio

### Step 2: Get API Credentials
- Sign up with chosen provider
- Get API keys

### Step 3: Update `.env`
```bash
# Copy your credentials here
SMS_PROVIDER=jazz  # or twilio, or http
JAZZ_API_KEY=your-key-here
# etc...
```

### Step 4: Restart Backend
```bash
cd backend
npm start
```

---

## Testing SMS

1. Go to **login.html**
2. Register with:
   - Name: Test User
   - Email: your-email@gmail.com
   - Phone: 03001234567 (Pakistani number)
   - Password: any password
3. Click **Register**
4. Check your phone for SMS! 📱

---

## Backend Terminal Output

### SMS Working ✅
```
✅ SMS sent via Jazz API
✅ SMS sent via Twilio: SMxxxxxxxxxxxx
✅ SMS sent via HTTP Gateway
```

### SMS NOT Working ❌
```
📱 SMS provider not configured
📱 SMS not configured. Skipping SMS notification.
```

---

## FAQ

**Q: Which is cheapest?**
A: Jazz has free tier, Zong is cheapest paid option

**Q: SMS to multiple providers?**
A: Update code to call multiple providers

**Q: Can I add SMS later?**
A: Yes! Just add credentials to `.env` and restart

**Q: Need both email AND SMS?**
A: Yes! Both are sent automatically on registration

---

## Support

Backend will show in terminal:
- ✅ What notifications were sent
- ❌ What failed and why

If SMS not working:
1. Check `.env` credentials
2. Check backend terminal for error
3. Verify phone number format (starts with +92 for Pakistan)
4. Restart backend after `.env` changes
