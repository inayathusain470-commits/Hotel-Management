require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: Missing Supabase credentials!');
  console.error('');
  console.error('ADD THESE ENVIRONMENT VARIABLES:');
  console.error('  SUPABASE_URL: https://vwjahaxogzccmpmofoow.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY: (copy from backend/.env)');
  console.error('');
  console.error('For Railway:');
  console.error('  1. Go to Railway Dashboard');
  console.error('  2. Select HMS project');
  console.error('  3. Variables tab');
  console.error('  4. Add the two variables above');
  console.error('');
  throw new Error('Missing Supabase credentials. See error messages above.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('✅ Supabase connected:', SUPABASE_URL);

module.exports = supabase;

