const express = require('express');
const supabase = require('../db');

const router = express.Router();

// Get all active coupons
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const parsed = data.map((c) => ({
      id: c.id,
      code: c.code,
      discountPercentage: c.discount_percentage,
      maxDiscountAmount: c.max_discount_amount,
      minBookingAmount: c.min_booking_amount,
      validFrom: c.valid_from,
      validUntil: c.valid_until,
      usageLimit: c.usage_limit,
      usageCount: c.usage_count
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  const { code, bookingAmount } = req.body;

  if (!code || !bookingAmount) {
    return res.status(400).json({ error: 'Code and booking amount required' });
  }

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Coupon not found or expired' });
    }

    // Check if valid
    const today = new Date();
    const validFrom = new Date(data.valid_from);
    const validUntil = new Date(data.valid_until);

    if (today < validFrom || today > validUntil) {
      return res.status(400).json({ error: 'Coupon expired' });
    }

    if (data.min_booking_amount && bookingAmount < data.min_booking_amount) {
      return res.status(400).json({
        error: `Minimum booking amount ₹${data.min_booking_amount} required`
      });
    }

    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    // Calculate discount
    let discount = (bookingAmount * data.discount_percentage) / 100;
    if (data.max_discount_amount && discount > data.max_discount_amount) {
      discount = data.max_discount_amount;
    }

    res.json({
      valid: true,
      discount: Math.round(discount),
      discountPercentage: data.discount_percentage,
      finalAmount: Math.round(bookingAmount - discount)
    });
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

// Apply coupon (increment usage)
router.put('/:code/apply', async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  try {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    const newUsageCount = (coupon.usage_count || 0) + 1;

    const { data, error } = await supabase
      .from('coupons')
      .update({ usage_count: newUsageCount })
      .eq('code', code.toUpperCase())
      .select();

    if (error) throw error;

    res.json({ message: 'Coupon applied successfully', data: data[0] });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

// Admin: Create coupon
router.post('/', async (req, res) => {
  const { code, discountPercentage, maxDiscountAmount, minBookingAmount, validFrom, validUntil, usageLimit } = req.body;

  if (!code || !discountPercentage || !validFrom || !validUntil) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: code.toUpperCase(),
        discount_percentage: discountPercentage,
        max_discount_amount: maxDiscountAmount || null,
        min_booking_amount: minBookingAmount || 0,
        valid_from: validFrom,
        valid_until: validUntil,
        usage_limit: usageLimit || null,
        is_active: true
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'Coupon created', data: data[0] });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

module.exports = router;
