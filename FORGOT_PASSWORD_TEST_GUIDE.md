# 🔐 Forgot Password Feature - Complete Testing Guide

**Status:** Backend API working ✅ | Email service needs configuration ⚙️ | Frontend ready ✅

---

## Phase 1: Configure Gmail SMTP (REQUIRED FOR EMAIL)

### Step 1a: Enable 2-Factor Authentication on Gmail
1. Go to: https://myaccount.google.com/security
2. Look for **"2-Step Verification"**
3. Click **"Enable"** and follow prompts
4. Verify your phone number

### Step 1b: Generate Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **"Mail"** in the first dropdown
3. Select **"Windows Computer"** in the second dropdown
4. Google will generate a **16-character password**
5. **Copy this password (you'll use it next)**

### Step 1c: Update Backend `.env` File
Edit `backend/.env` and update these lines:

```ini
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**Example:**
```ini
EMAIL_USER=inayat@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
```

### Step 1d: Restart Backend Server
```powershell
cd backend
npm start
```

---

## Phase 2: Test Frontend - Forgot Password Link

### Step 2a: Access Login Page
Choose ONE of these pages:
- `http://localhost:3000/customer_login.html` (Dedicated customer login)
- `http://localhost:3000/index.html` (Home with login form)
- `http://localhost:3000/login.html` (Alternative login)

### Step 2b: Look for Forgot Password Link
You should see one of these:
- **Gold underlined button:** "🔑 Forgot Password? Click here"
- **Gold underlined link:** Below the "Register here" link

**If you don't see it:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check browser console (F12) for errors

---

## Phase 3: Test Password Reset Flow

### STEP 1️⃣ Click the Forgot Password Link
- Modal should appear with title: **"Reset Your Password"**
- First screen should have:
  - Input field labeled: "Email"
  - Button: "Send Code"
  - Message area below (empty at first)

### STEP 2️⃣ Enter Email Address
- Use one of these test customer emails:
  - `inayat@gmail.com` (Customer 1)
  - `innuhero@gmail.com` (Customer 2)
- Click **"Send Code"** button

### ✅ EXPECT:
- **Success Message:** "✅ Reset code sent to your email"
- Modal switches to **Step 2**
- New fields appear:
  - Input: "Enter 6-digit code"
  - Input: "New password (min 6 chars)"
  - Input: "Confirm password"
  - Button: "Reset Password"
  - Back button: "← Back"

### ❌ IF ERROR:
- **"Error: Email not found"** → Customer not registered
- **"Error: Email service offline"** → Backend not running or .env not configured
- **"Error: Server error"** → Check backend console for logs

---

## Phase 4: Receive Email Code

### Check Gmail Inbox
1. **Open Gmail** for the email address you entered
2. **Look for email from:** Support address (or your EMAIL_USER)
3. **Subject line:** "Password Reset Code - Royal Plaza Hotel"

### Email Should Contain:
- ✅ Lock icon (🔐)
- ✅ Hotel name: "Royal Plaza Hotel"
- ✅ Large 6-digit code (e.g., **384621**)
- ✅ Warning: "Code expires in 15 minutes"
- ✅ Footer: Hotel support email

### ⏱️ Time Limit
- Code valid for **15 minutes** only
- After 15 minutes, must request new code

---

## Phase 5: Enter Code & New Password

### STEP 3️⃣ Enter Code in Modal
1. Copy the **6-digit code** from email
2. Paste into modal field: "Enter 6-digit code"
3. Example: `384621`

### STEP 4️⃣ Enter New Password
1. Input field: "New password (min 6 chars)"
2. Requirements:
   - Minimum **6 characters**
   - Example: `NewPass123`

### STEP 5️⃣ Confirm Password
1. Input field: "Confirm password"
2. Must match exactly with "New password"
3. If different: Error "Passwords don't match"

### STEP 6️⃣ Click "Reset Password" Button
- Button label: **"Reset Password"**

### ✅ EXPECT:
- **Success Message:** "✅ Password reset successfully! Logging you in..."
- Modal closes automatically
- Page redirects to home/dashboard
- **Auto-login** with new credentials

### ❌ IF ERROR:
- **"Invalid or expired code"** → Code wrong or >15 min old (request new one)
- **"Passwords don't match"** → Confirm password doesn't match new password
- **"Password too short"** → Use at least 6 characters

---

## Phase 6: Verify New Password Works

### Test Login with New Password
1. **Log out** from current session
2. **Navigate to login page** (index.html, login.html, or customer_login.html)
3. **Enter credentials:**
   - Email: `inayat@gmail.com` (or the email you used)
   - Password: `NewPass123` (the new password you set)
4. Click **"Login"** button

### ✅ EXPECT:
- **Success:** Page redirects to dashboard/home
- **Customer is logged in** with new credentials
- Confirm correct customer name/info displayed

### ❌ IF LOGIN FAILS:
- Old password still works → Database didn't update
- New password doesn't work → Code wasn't applied correctly
- Check backend logs for errors

---

## Phase 7: Test Edge Cases

### ❌ Test 1: Expired Code
1. Request reset code
2. **Wait 15+ minutes** (or manually set expiry to past)
3. Try to enter code and reset password
4. **Expected:** "Invalid or expired code" error

### ❌ Test 2: Wrong Code
1. Request reset code (e.g., `123456`)
2. Enter **different code** (e.g., `654321`)
3. Try to reset
4. **Expected:** "Invalid or expired code" error

### ❌ Test 3: Mismatched Passwords
1. Enter code correctly
2. New password: `Test1234`
3. Confirm password: `Test5678` (different)
4. Click "Reset Password"
5. **Expected:** "Passwords don't match" error

### ❌ Test 4: Password Too Short
1. Enter code correctly
2. New password: `Test` (only 4 chars)
3. Click "Reset Password"
4. **Expected:** "Password too short" error

### ❌ Test 5: Unregistered Email
1. Click "Forgot Password?"
2. Enter email: `notregistered@gmail.com`
3. Click "Send Code"
4. **Expected:** "Email not found" error

---

## Backend API Testing (For Developers)

If frontend testing shows issues, test APIs directly:

### Test 1: List All Customers
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/customers" -Method GET
$response.Content | ConvertFrom-Json
```

**Expected Response:**
```json
[
  {
    "id": "42f068d1-cd3a-4d35-8a6f-029d178a3939",
    "name": "inayat",
    "email": "innuhero@gmail.com",
    "phone": "8081827063"
  },
  {
    "id": "a8c3c26d-3b66-490d-935f-cb1a89caec14",
    "name": "inayat",
    "email": "inayat@gmail.com",
    "phone": "8081828384"
  }
]
```

### Test 2: Request Password Reset Code
```powershell
$uri = "http://localhost:5000/api/customers/forgot-password"
$body = @{"email" = "inayat@gmail.com"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $body
$response.Content | ConvertFrom-Json
```

**Expected Response:**
```json
{
  "message": "Password reset code sent to your email",
  "email": "inayat@gmail.com"
}
```

**If Email Error Appears:**
```
"❌ Password reset email error: Invalid login: 535-5.7.8 Username and Password not accepted"
```
→ Fix: Update EMAIL_USER and EMAIL_PASSWORD in .env with valid Gmail credentials

### Test 3: Reset Password (with correct code - check backend logs)
```powershell
$uri = "http://localhost:5000/api/customers/reset-password"
$body = @{
  "email" = "inayat@gmail.com"
  "resetCode" = "123456"
  "newPassword" = "NewPassword123"
} | ConvertTo-Json
$response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $body
$response.Content | ConvertFrom-Json
```

**Expected Response (if code correct):**
```json
{
  "message": "Password reset successfully",
  "customer": {
    "id": "a8c3c26d-3b66-490d-935f-cb1a89caec14",
    "email": "inayat@gmail.com",
    "name": "inayat"
  }
}
```

---

## ✅ Checklist - Feature Complete When:

- [ ] Backend is running: `npm start` ✅
- [ ] Supabase connected: "✅ Supabase connected" in logs ✅
- [ ] Gmail SMTP configured: Valid EMAIL_USER and EMAIL_PASSWORD in .env ✅
- [ ] Frontend accessed: Can see forgot password link on login page ✅
- [ ] Email sent successfully: "Reset code sent to your email" message ✅
- [ ] Email received: 6-digit code appears in Gmail inbox ✅
- [ ] Code accepted: Can enter code into modal without error ✅
- [ ] Password reset: Success message appears ✅
- [ ] Auto-login works: Redirected after password change ✅
- [ ] New password works: Can login with new credentials ✅
- [ ] Expiry works: Code fails after 15 minutes ✅
- [ ] Wrong code fails: Invalid codes rejected ✅

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Email link missing" | Hard refresh (Ctrl+Shift+R), clear cache |
| "Send Code returns error" | Backend not running, check logs |
| "Email not received" | Check .env EMAIL_USER/PASSWORD, restart backend |
| "Code not working" | Code expired (>15 min), try requesting new one |
| "Auto-login not working" | Check browser console for JavaScript errors |
| "New password doesn't work" | Check database for password update, verify email used |

---

## 📝 Next Steps (After Verification)

1. ✅ **Phase Completed:** Feature verified end-to-end
2. ⏳ **Improvements to consider:**
   - Add bcrypt password hashing (security upgrade)
   - Move reset codes to database (scalability)
   - Add rate limiting (prevent brute force)
   - Implement SMS fallback option
   - Add admin/staff password reset

---

**Last Updated:** April 6, 2026
**Feature Status:** Ready for Testing ✅
**Email Service Status:** Requires .env Configuration ⚙️

