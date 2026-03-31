const express = require('express');
const supabase = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, password are required' });
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: (phone || '').trim(),
          password: password
        }
      ])
      .select();

    if (error) {
      if (error.message.includes('unique')) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      throw error;
    }

    return res.status(201).json({ id: data[0].id, message: 'Customer registered' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Unable to register customer' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email, phone')
      .eq('email', email.trim().toLowerCase())
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ message: 'Login successful', customer: data });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
