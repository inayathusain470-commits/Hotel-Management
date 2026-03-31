const express = require('express');
const supabase = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bar_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const parsed = data.map((r) => ({
      id: r.id,
      name: r.name,
      customerEmail: r.customer_email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      packageName: r.package_name,
      packagePrice: r.package_price,
      total: r.total,
      status: r.status,
      timestamp: r.created_at,
      payment: r.payment
    }));
    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch bar bookings' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body || {};
  const required = ['name', 'phone', 'date', 'time', 'guests', 'package_name', 'package_price', 'total'];
  const missing = required.filter((k) => payload[k] === undefined || payload[k] === null || payload[k] === '');
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    const { data, error } = await supabase
      .from('bar_bookings')
      .insert([
        {
          name: payload.name,
          customer_email: payload.customer_email ? String(payload.customer_email).toLowerCase() : null,
          phone: payload.phone,
          date: payload.date,
          time: payload.time,
          guests: Number(payload.guests),
          package_name: payload.package_name,
          package_price: Number(payload.package_price),
          total: Number(payload.total),
          payment_method: payload.payment_method || null,
          payment_txn_id: payload.payment_txn_id || null,
          payment_reference: payload.payment_reference || null,
          payment: payload.payment || null,
          status: payload.status || 'booked'
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id, message: 'Bar booking saved' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to create bar booking' });
  }
});

// Cancel Bar Booking
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Bar booking ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('bar_bookings')
      .update({ status: status || 'cancelled' })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Bar booking not found' });
    }

    res.json({ message: 'Bar booking cancelled successfully', data: data[0] });
  } catch (err) {
    console.error('Cancel bar booking error:', err);
    res.status(500).json({ error: 'Failed to cancel bar booking' });
  }
});

module.exports = router;
