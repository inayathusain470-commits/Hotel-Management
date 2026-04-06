# 🚀 Quick Start Guide - New Features

## AI Chat Feature

### How to Use AI Chat

**At Login Pages:**
1. Look for **💬** button in bottom-right corner
2. Click it to open the chat widget
3. Type your question (e.g., "Tell me about rooms")
4. Read AI response
5. Click ✕ to close

**Available on:**
- Customer Login Page
- Home Page (with login forms)
- Dedicated Login Page
- Admin Login
- Staff Login

**Example Questions:**
- "What amenities do you have?"
- "How much are rooms?"
- "How do I book?"
- "What's your contact number?"
- "Tell me about the gym"

---

## Password Lookup Feature

### How to Look Up Your Password

**At Login Pages:**
1. Click **"🔑 Forgot Password? Click here"** link
2. Enter your email address
   - Example: `inayat@gmail.com`
3. Click **"Lookup Password"** button (gold/yellow color)
4. See your password displayed instantly!
   - Shows: Customer name + Password
   - Example: "Hello inayat! Your password is: 7860"

**Available on:**
- customer_login.html
- index.html (home page)
- login.html

---

## Two Password Recovery Options

### Option 1: Lookup Password ⚡ (Instant)
**Best for:** Remembering forgotten password quickly

Steps:
1. Click "🔑 Forgot Password?"
2. Enter email
3. Click **"Lookup Password"** (Gold button)
4. Password shown instantly

Pros:
- ✅ Instant retrieval
- ✅ No email needed
- ✅ Fast login

---

### Option 2: Reset with Code 📧 (Secure)
**Best for:** Changing password securely

Steps:
1. Click "🔑 Forgot Password?"
2. Enter email
3. Click **"Send Reset Code"** (Blue button)
4. Check email for 6-digit code
5. Enter code + new password
6. Auto-login with new password

Pros:
- ✅ More secure
- ✅ Email verification
- ✅ Change password too
- ✅ 15-minute security window

---

## UI Element Locations

### Chat Button
```
                          [Chat 💬]  ← Click here
                                     (Bottom-right fixed)
```

### Password Links
```
Customer Login Page:
─────────────────────────
    [Login Form]
    [Password input]
    [Login Button]
    
    🔑 Forgot Password?    ← Click here
    [Modal opens]
    
Modal - Step 1:
─────────────────────────
    Email: [_____________]
    
    [Send Reset Code] [Lookup Password]
    [Cancel]
```

---

## Test Credentials

**Test Customer:**
- Email: `inayat@gmail.com`
- Password: `7860`
- Name: inayat

**Try:**
1. Go to login page
2. Click "🔑 Forgot Password?"
3. Enter: `inayat@gmail.com`
4. Click "Lookup Password"
5. See: Password retrieved!

---

## 🎨 Color Theme

| Element | Color | Usage |
|---------|-------|-------|
| Chat Button | Blue Gradient | Floating chat icon |
| Chat Header | Blue (#1565c0) | Chat widget header |
| Chat Messages | Light Gray | Message background |
| Lookup Button | Gold (#D4AF37) | Password lookup |
| Reset Button | Blue (#1565c0) | Email reset code |
| Error Text | Red | Error messages |
| Success Text | Green | Success messages |

---

## Backend API Reference

### Password Lookup Endpoint
```
POST /api/customers/lookup-password
Content-Type: application/json

Request:
{
  "email": "customer@email.com"
}

Success Response (200):
{
  "message": "Password retrieved successfully",
  "email": "customer@email.com",
  "name": "Customer Name",
  "password": "customer_password"
}

Error Response (404):
{
  "error": "Email not found in our records"
}
```

---

## Troubleshooting

### Chat Not Opening
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)
- Check browser console (F12) for errors

### Password Lookup Shows Error
- Check email is correct
- Verify customer is registered
- Try with test email: inayat@gmail.com

### Chat Messages Not Showing
- Reload page
- Clear browser data
- Try different browser

### Backend Not Responding
- Check backend running: `npm start`
- Verify at: http://localhost:5000/api/customers
- Check port 5000 not blocked

---

## Features by Page

### customer_login.html
✅ AI Chat
✅ Password Lookup
✅ Email Reset Code

### index.html (Home)
✅ AI Chat
✅ Password Lookup
✅ Email Reset Code
✅ Full Navigation

### login.html
✅ AI Chat
✅ Password Lookup
✅ Email Reset Code
✅ Simple Login Form

### admin_login.html
✅ AI Chat
❌ Password Lookup (Admin only)
❌ Email Reset (Admin only)

### staff_login.html
✅ AI Chat
❌ Password Lookup (Staff only)
❌ Email Reset (Staff only)

---

## 📞 Support

**For Issues:**
1. Check browser console (F12)
2. Verify backend running
3. Try clearing browser cache
4. Contact support with error message

**Email Support:**
- support@royalplaza.com

**Live Chat:**
- Use 💬 button on page

---

## Version Info

**Features Version:** 1.0  
**Implementation Date:** April 6, 2026  
**Status:** Active & Ready  
**Backend API:** Running on port 5000  
**Database:** Supabase PostgreSQL  

---

Last Updated: April 6, 2026

