@echo off
REM Quick deployment script for Windows
setlocal enabledelayedexpansion

title Royal Plaza HMS - Deployment Helper
color 0A

echo.
echo ============================================
echo  ^|  Royal Plaza HMS - Deployment Guide  ^|
echo ============================================
echo.

REM Step 1: Check backend
echo 1/5 Checking backend structure...
if not exist "backend\package.json" (
    echo ERROR: backend/package.json not found
    pause
    exit /b 1
)
echo [OK] Backend package.json found
echo.

REM Step 2: Install dependencies
echo 2/5 Installing backend dependencies...
cd backend
call npm install >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 3: Verify start script
echo 3/5 Verifying start script...
findstr /M "\"start\": \"node src/server.js\"" package.json >nul 2>&1
if errorlevel 1 (
    echo WARNING: Check your start script in package.json
) else (
    echo [OK] Start script is correct
)
echo.

cd ..

REM Step 4: Git preparation
echo 4/5 Preparing for deployment...
git add . >nul 2>&1
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
git commit -m "Deploy: %mydate% %mytime%" >nul 2>&1
echo [OK] Changes staged

echo.
echo ============================================
echo  DEPLOYMENT CHECKLIST
echo ============================================
echo.
echo [^!] LOCAL SETUP COMPLETE
echo.
echo Next Steps:
echo.
echo 1. Push to GitHub:
echo    git push origin master
echo.
echo 2. Go to Railway Dashboard (railway.app)
echo    a. Create New Project
echo    b. Connect GitHub Repo: Hotel-Management
echo    c. Select master branch
echo.
echo 3. Add Environment Variables:
echo    PORT=3000
echo    NODE_ENV=production
echo    SUPABASE_URL=https://vwjahaxogzccmpmofoow.supabase.co
echo    SUPABASE_SERVICE_ROLE_KEY=[from backend/.env]
echo    SUPABASE_ANON_KEY=[from backend/.env]
echo.
echo 4. After Deploy, Update Frontend:
echo    Edit: js/script.js (line 229)
echo    Old: const API_BASE_URL = 'http://localhost:5000/api';
echo    New: const API_BASE_URL = 'https://your-railway-url.railway.app/api';
echo.
echo ============================================
echo     READY FOR DEPLOYMENT!
echo ============================================
echo.
pause
