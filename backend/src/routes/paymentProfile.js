const express = require('express');
const supabase = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payment_profile')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    res.json(data || null);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch payment profile' });
  }
});

router.put('/', async (req, res) => {
  const payload = req.body || {};
  const required = ['accountHolder', 'upiId', 'bankName', 'accountNumber', 'ifsc'];
  const missing = required.filter((k) => !payload[k]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    // First try to get existing profile
    const { data: existing } = await supabase
      .from('payment_profile')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('payment_profile')
        .update({
          account_holder: payload.accountHolder,
          upi_id: payload.upiId,
          bank_name: payload.bankName,
          account_number: payload.accountNumber,
          ifsc: payload.ifsc,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();
    } else {
      // Insert new
      result = await supabase
        .from('payment_profile')
        .insert([
          {
            account_holder: payload.accountHolder,
            upi_id: payload.upiId,
            bank_name: payload.bankName,
            account_number: payload.accountNumber,
            ifsc: payload.ifsc
          }
        ])
        .select();
    }

    const { error } = result;
    if (error) throw error;
    res.json({ message: 'Payment profile updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update payment profile' });
  }
});

module.exports = router;
