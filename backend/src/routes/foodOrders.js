const express = require('express');
const supabase = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const parsed = data.map((r) => ({
      id: r.id,
      name: r.name,
      customerEmail: r.customer_email,
      room: r.room,
      phone: r.phone,
      total: r.total,
      status: r.status,
      timestamp: r.created_at,
      items: r.items || [],
      payment: r.payment
    }));
    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch food orders' });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body || {};
  const required = ['name', 'room', 'items', 'total'];
  const missing = required.filter((k) => payload[k] === undefined || payload[k] === null || payload[k] === '');
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    // Build insert object with all fields properly typed
    const insertData = {
      name: String(payload.name),
      customer_email: payload.customer_email ? String(payload.customer_email).toLowerCase() : null,
      room: String(payload.room),
      phone: payload.phone ? String(payload.phone) : null,
      items: Array.isArray(payload.items) ? payload.items : [],
      total: Number(payload.total) || 0,
      payment_method: payload.payment_method ? String(payload.payment_method) : null,
      payment_txn_id: payload.payment_txn_id ? String(payload.payment_txn_id) : null,
      payment_reference: payload.payment_reference ? String(payload.payment_reference) : null,
      payment: payload.payment || null,
      status: payload.status ? String(payload.status) : 'pending'
    };

    // Attempt insert
    const { data, error } = await supabase
      .from('food_orders')
      .insert([insertData])
      .select();

    if (error) {
      // Check for schema cache error
      if (error.code === 'PGRST204' || error.message?.includes('Could not find')) {
        console.log('⚠️  Schema Cache Issue - Attempting workaround...');
        // Wait a moment and retry
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: retryData, error: retryError } = await supabase
          .from('food_orders')
          .insert([insertData])
          .select();
        
        if (retryError) {
          console.error('Retry failed:', retryError.message);
          return res.status(503).json({ 
            error: 'Service temporarily unavailable. Please try again.',
            code: 'SCHEMA_SYNC_ERROR'
          });
        }
        
        res.status(201).json({ id: retryData[0].id, message: 'Food order saved' });
        return;
      }
      
      throw error;
    }

    res.status(201).json({ id: data[0].id, message: 'Food order saved' });
  } catch (err) {
    console.error('Food order insert error:', err.message || err.code || err);
    
    const errorMsg = err.message || 'Failed to create food order';
    const statusCode = err.code === 'PGRST204' ? 503 : 500;
    
    res.status(statusCode).json({ 
      error: 'Failed to create food order',
      details: errorMsg.substring(0, 100)
    });
  }
});

router.put('/:id/status', async (req, res) => {
  const id = req.params.id;
  const status = (req.body && req.body.status) ? String(req.body.status) : '';
  if (!id || !status) {
    return res.status(400).json({ error: 'id and status are required' });
  }

  try {
    const { data, error } = await supabase
      .from('food_orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel Food Order
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Order ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('food_orders')
      .update({ status: status || 'cancelled' })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order cancelled successfully', data: data[0] });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
