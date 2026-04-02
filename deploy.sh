#!/bin/bash
# Quick deployment script for Railway

echo "🏨 Royal Plaza HMS - Deployment Helper"
echo "======================================"
echo ""

# Step 1: Verify backend
echo "1️⃣  Checking backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Error: backend/package.json not found"
    exit 1
fi

echo "✅ Backend package.json found"

# Step 2: Check dependencies
echo ""
echo "2️⃣  Installing dependencies..."
npm install > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ npm install failed"
    exit 1
fi

# Step 3: Quick test
echo ""
echo "3️⃣  Testing backend..."
timeout 5 npm start > /tmp/test.log 2>&1 &
sleep 2

if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend responding"
else
    echo "⚠️  Backend not responding (might be normal)"
fi

pkill -f "node src/server.js" 2>/dev/null

cd ..

# Step 4: Git commit
echo ""
echo "4️⃣  Preparing for deployment..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Changes committed"
fi

# Step 5: Instructions
echo ""
echo "======================================"
echo "✅ Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. git push origin master"
echo "2. Go to railway.app and trigger new deployment"
echo "3. Add environment variables in Railway Dashboard:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SUPABASE_ANON_KEY"
echo ""
echo "Then update: js/script.js with Railway URL"
echo "======================================"
