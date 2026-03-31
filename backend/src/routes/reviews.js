const express = require('express');
const supabase = require('../db');

const router = express.Router();

// Get reviews for a room type
router.get('/', async (req, res) => {
  const { roomType } = req.query;

  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });

    if (roomType) {
      query = query.eq('room_type', roomType);
    }

    const { data, error } = await query;

    if (error) throw error;

    const parsed = data.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      roomType: r.room_type,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verifiedBooking: r.verified_booking,
      createdAt: r.created_at
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get average rating for a room type
router.get('/rating/:roomType', async (req, res) => {
  const { roomType } = req.params;

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('room_type', roomType);

    if (error) throw error;

    if (data.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    const totalRating = data.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / data.length).toFixed(1);

    res.json({
      averageRating: parseFloat(averageRating),
      totalReviews: data.length
    });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

// Submit a review
router.post('/', async (req, res) => {
  const { bookingId, customerEmail, customerName, roomType, rating, title, comment } = req.body;

  if (!customerEmail || !customerName || !rating || !roomType) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        booking_id: bookingId || null,
        customer_email: customerEmail.toLowerCase(),
        customer_name: customerName,
        room_type: roomType,
        rating: rating,
        title: title || '',
        comment: comment || '',
        verified_booking: !!bookingId
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: 'Review submitted successfully',
      data: data[0]
    });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Delete review (admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Review ID required' });
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
