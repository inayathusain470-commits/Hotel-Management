/**
 * Script to create/migrate payment_profile table and insert data
 * Run: node migrate-payment-profile.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const paymentData = {
  accountHolder: 'INAYAT HUSAIN',
  upiId: '9044089140@kotak811',
  bankName: 'Kotak Bank',
  accountNumber: '5450882039',
  ifsc: 'KKBK0005633',
  supportPhone: '+91-9044089140'
};

async function setupPaymentProfile() {
  try {
    console.log('🔧 Setting up payment profile...');
    console.log('📡 Connecting to Supabase...\n');

    // Check if profile exists
    console.log('🔍 Checking existing payment profile...');
    const { data: existing, error: fetchError } = await supabase
      .from('payment_profile')
      .select('id')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      console.log('✏️  Updating existing payment profile (ID: ' + existing.id + ')...');
      const { data, error } = await supabase
        .from('payment_profile')
        .update({
          account_holder: paymentData.accountHolder,
          upi_id: paymentData.upiId,
          bank_name: paymentData.bankName,
          account_number: paymentData.accountNumber,
          ifsc: paymentData.ifsc,
          support_phone: paymentData.supportPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();

      if (error) throw error;
      console.log('✅ Payment profile updated successfully!');
      console.log('📋 Updated Data:', data);
    } else {
      console.log('➕ Creating new payment profile...');
      const { data, error } = await supabase
        .from('payment_profile')
        .insert([{
          account_holder: paymentData.accountHolder,
          upi_id: paymentData.upiId,
          bank_name: paymentData.bankName,
          account_number: paymentData.accountNumber,
          ifsc: paymentData.ifsc,
          support_phone: paymentData.supportPhone
        }])
        .select();

      if (error) throw error;
      console.log('✅ Payment profile created successfully!');
      console.log('📋 New Data:', data);
    }

    console.log('\n🎉 Payment profile setup complete!');
    console.log('📡 Backend API: GET/PUT /api/payment-profile');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
}

setupPaymentProfile();
