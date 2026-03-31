const express = require('express');
const supabase = require('../db');

const router = express.Router();

// Get notifications for a user
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_email', email.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const parsed = data.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.is_read,
      actionUrl: n.action_url,
      createdAt: n.created_at
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread notification count
router.get('/count/unread', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_email', email.toLowerCase())
      .eq('is_read', false);

    if (error) throw error;

    res.json({ unreadCount: data.length });
  } catch (err) {
    console.error('Count error:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Create notification (internal use)
router.post('/', async (req, res) => {
  const { userEmail, title, message, type, actionUrl } = req.body;

  if (!userEmail || !title || !message) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_email: userEmail.toLowerCase(),
        title: title,
        message: message,
        type: type || 'info',
        action_url: actionUrl || null
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Notification created', data: data[0] });
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Notification ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ message: 'Notification marked as read', data: data[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_email', email.toLowerCase());

    if (error) throw error;

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Notification ID required' });
  }

  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
