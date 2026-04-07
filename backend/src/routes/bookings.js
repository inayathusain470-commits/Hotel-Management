const express = require('express');
const supabase = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Helper function to calculate nights
    const calculateNights = (checkinStr, checkoutStr) => {
      const checkin = new Date(checkinStr);
      const checkout = new Date(checkoutStr);
      return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    };

    const parsed = data.map((r) => {
      const nights = calculateNights(r.checkin, r.checkout);
      
      // Parse roomNumbers - handle both array and string formats
      let roomNumbers = r.room_numbers || [];
      if (typeof roomNumbers === 'string') {
        try {
          roomNumbers = JSON.parse(roomNumbers);
        } catch (e) {
          roomNumbers = roomNumbers.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
        }
      }
      
      // Parse payment object if it's stored as string
      let payment = r.payment || null;
      if (typeof payment === 'string') {
        try {
          payment = JSON.parse(payment);
        } catch (e) {
          console.log('Could not parse payment JSON:', e);
        }
      }
      
      // If price_per_night column doesn't exist (NULL), calculate from total_amount_inr
      let pricePerNight = r.price_per_night || 0;
      if (!pricePerNight && r.total_amount_inr && nights > 0) {
        pricePerNight = Math.round(r.total_amount_inr / nights);
      }
      
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        checkin: r.checkin,
        checkout: r.checkout,
        roomType: r.room_type,
        roomQuantity: r.room_quantity,
        roomNumbers: roomNumbers,
        pricePerNight: pricePerNight,
        totalAmountInr: r.total_amount_inr,
        status: r.status,
        timestamp: r.created_at,
        payment: payment
      };
    });
    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body || {};
  const required = ['name', 'email', 'phone', 'checkin', 'checkout', 'room_type', 'room_quantity', 'total_amount_inr'];
  const missing = required.filter((k) => payload[k] === undefined || payload[k] === null || payload[k] === '');
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    // Ensure room_numbers is stored correctly
    let roomNumbersData = payload.room_numbers || [];
    // Don't stringify - send as array for room_numbers JSON array
    if (typeof roomNumbersData === 'string') {
      try {
        roomNumbersData = JSON.parse(roomNumbersData);
      } catch (e) {
        roomNumbersData = [];
      }
    }

    // For JSONB field, don't stringify - send object directly
    let paymentData = payload.payment || null;
    
    const bookingData = {
      name: payload.name,
      email: String(payload.email).toLowerCase(),
      phone: payload.phone,
      checkin: payload.checkin,
      checkout: payload.checkout,
      room_type: payload.room_type,
      room_quantity: Number(payload.room_quantity),
      room_numbers: roomNumbersData,
      total_amount_inr: Number(payload.total_amount_inr),
      payment_method: payload.payment_method || null,
      payment_txn_id: payload.payment_txn_id || null,
      payment_reference: payload.payment_reference || null,
      payment: paymentData,
      status: payload.status || 'booked'
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message || error);
      throw error;
    }
    res.status(201).json({ id: data[0].id, message: 'Booking saved' });
  } catch (err) {
    console.error('Insert error:', err.message || err);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

// Cancel Booking
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Booking ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: status || 'cancelled' })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully', data: data[0] });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
