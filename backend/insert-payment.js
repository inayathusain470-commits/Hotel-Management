/**
 * Insert payment profile data - simplified version
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPaymentData() {
  try {
    console.log('💾 Inserting payment profile data...\n');

    // Try different column name formats
    const paymentRecord = {
      account_holder: 'INAYAT HUSAIN',
      upi_id: '9044089140@kotak811',
      bank_name: 'Kotak Bank',
      account_number: '5450882039',
      ifsc_code: 'KKBK0005633',
      support_phone: '+91-9044089140',
      created_at: new Date().toISOString()
    };

    console.log('📤 Attempting to insert:');
    console.log(JSON.stringify(paymentRecord, null, 2));

    const { data, error } = await supabase
      .from('payment_profile')
      .insert([paymentRecord])
      .select();

    if (error) {
      console.log('\n❌ Insert failed:', error.message);
      console.log('Code:', error.code);
      
      // Try alternative column names
      console.log('\n🔄 Retrying with alternative column names...');
      
      const altRecord = {
        accountHolder: 'INAYAT HUSAIN',
        upiId: '9044089140@kotak811',
        bankName: 'Kotak Bank',
        accountNumber: '5450882039',
        ifsc: 'KKBK0005633',
        supportPhone: '+91-9044089140'
      };

      const { data: data2, error: error2 } = await supabase
        .from('payment_profile')
        .insert([altRecord])
        .select();

      if (error2) {
        console.log('❌ Alternative also failed:', error2.message);
        process.exit(1);
      }
      
      console.log('✅ Success with alternative names!');
      console.log('📋 Data:', data2);
    } else {
      console.log('\n✅ Payment profile inserted successfully!');
      console.log('📋 Data:', data);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

insertPaymentData();
