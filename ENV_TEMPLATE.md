# Environment Variables Reference
# Copy backend/.env from this template

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# Supabase Database
SUPABASE_URL=https://vwjahaxogzccmpmofoow.supabase.co
SUPABASE_ANON_KEY=sb_publishable_45kZV-gRzPfZqcWasujxIg_Za79trb_eL1ohjTKNx4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3amFoYXhvZ3pjY21wbW9mb293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3NzE3MywiZXhwIjoyMDkwNDUzMTczfQ.S6B1Rr4f_2geBw93xOGX-hkZPjWU7xKx-uYv_-KIQtk

# Email Configuration (Gmail)
# Get App Password from: https://myaccount.google.com/apppasswords
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-16-chars

# SMS Configuration - Choose ONE provider:

# Option 1: Twilio (International - Paid)
# Sign up: https://www.twilio.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Option 2: Jazz/Mobilink SMS (Pakistan - Free)
# Sign up: https://jazzweb.pk
SMS_PROVIDER=jazz
JAZZ_API_URL=https://api.jazzweb.pk/v2/SendSMS
JAZZ_API_KEY=your-jazz-api-key
JAZZ_SENDER_ID=RoyalPlaza

# PostgreSQL Direct Connection (Already in Supabase)
DATABASE_URL=postgresql://postgres:inayat470074@db.vwjahaxogzccmpmofoow.supabase.co:5432/postgres

----- RAILWAY.APP ENVIRONMENT VARIABLES -----

For production deployment on Railway, use SAME variables above but:
- PORT will be auto-set by Railway (usually 3000 or 8000)
- NODE_ENV=production
- All Supabase values same as above
- Email/SMS values same if configured

WARNING: Never commit .env file to Git!
