const express = require('express');
const supabase = require('../db');
const { sendWelcomeEmail, sendWelcomeSMS, sendPasswordResetEmail } = require('../services/notificationService');

const router = express.Router();

// Store reset codes in memory (temp storage) - in production use Redis or DB
const resetCodes = new Map();

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

    const customer = data[0];

    // Send welcome notifications (asynchronously - don't wait)
    if (customer.email) {
      sendWelcomeEmail(customer).catch(err => console.error('Failed to send email:', err));
    }
    if (customer.phone) {
      sendWelcomeSMS(customer).catch(err => console.error('Failed to send SMS:', err));
    }

    return res.status(201).json({ id: customer.id, message: 'Customer registered successfully. Check your email and SMS!' });
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.random().toString().slice(2, 8).padStart(6, '0');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    resetCodes.set(email.toLowerCase(), { code: resetCode, expiresAt, userId: data.id });

    // Send email with reset code
    await sendPasswordResetEmail(data, resetCode);

    return res.json({ message: 'Password reset code sent to your email', email: data.email });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process forgot password request' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body || {};
  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ error: 'Email, reset code, and new password are required' });
  }

  try {
    const emailLower = email.trim().toLowerCase();
    const codeData = resetCodes.get(emailLower);

    // Verify reset code
    if (!codeData) {
      return res.status(400).json({ error: 'Invalid or expired reset code. Please try again.' });
    }

    if (Date.now() > codeData.expiresAt) {
      resetCodes.delete(emailLower);
      return res.status(400).json({ error: 'Reset code expired. Please request a new one.' });
    }

    if (codeData.code !== resetCode) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    // Update password in database
    const { data, error } = await supabase
      .from('customers')
      .update({ password: newPassword })
      .eq('email', emailLower)
      .select('id, name, email');

    if (error) throw error;

    // Remove used reset code
    resetCodes.delete(emailLower);

    return res.json({ message: 'Password reset successfully', customer: data[0] });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Password lookup - retrieve password by email
router.post('/lookup-password', async (req, res) => {
  const { email } = req.body || {};
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, email, password, name')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Email not found in our records' });
    }

    // Security note: In production, this should be hashed, not plaintext
    return res.json({
      message: 'Password retrieved successfully',
      email: data.email,
      name: data.name,
      password: data.password
    });
  } catch (err) {
    console.error('Password lookup error:', err);
    return res.status(500).json({ error: 'Failed to lookup password' });
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
