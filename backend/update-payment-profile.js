/**
 * Script to update payment profile in database
 * Run: node update-payment-profile.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const paymentData = {
  account_holder: 'INAYAT HUSAIN',
  upi_id: '9044089140@kotak811',
  bank_name: 'Kotak Bank',
  account_number: '5450882039',
  ifsc: 'KKBK0005633',
  support_phone: '+91-9044089140'
};

async function updatePaymentProfile() {
  try {
    console.log('🔍 Checking existing payment profile...');
    
    // Check if profile exists
    const { data: existing, error: fetchError } = await supabase
      .from('payment_profile')
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      console.log('✏️  Updating existing payment profile...');
      const { data, error } = await supabase
        .from('payment_profile')
        .update({
          ...paymentData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();

      if (error) throw error;
      console.log('✅ Payment profile updated successfully!');
      console.log('📋 Data:', data);
    } else {
      console.log('➕ Creating new payment profile...');
      const { data, error } = await supabase
        .from('payment_profile')
        .insert([paymentData])
        .select();

      if (error) throw error;
      console.log('✅ Payment profile created successfully!');
      console.log('📋 Data:', data);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

updatePaymentProfile();
