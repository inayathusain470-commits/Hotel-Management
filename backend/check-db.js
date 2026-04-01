/**
 * Check what tables exist in database
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('📊 Checking database schema...\n');

    // Try to get existing data from payment_profile
    console.log('1️⃣  Checking payment_profile table:');
    const { data: ppData, error: ppError } = await supabase
      .from('payment_profile')
      .select('*')
      .limit(1);

    if (ppError) {
      console.log('❌ Error:', ppError.message);
      console.log('   Code:', ppError.code);
    } else {
      console.log('✅ Table exists');
      console.log('   Data count:', ppData?.length || 0);
      if (ppData && ppData.length > 0) {
        console.log('   Sample record:', ppData[0]);
        console.log('   Columns:', Object.keys(ppData[0]));
      }
    }

    // Check other tables
    console.log('\n2️⃣  Available tables:');
    const tables = ['customers', 'bookings', 'bar_bookings', 'food_orders', 'coupons', 'reviews', 'contacts'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();
