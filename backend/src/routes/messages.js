const express = require('express');
const supabase = require('../db');

const router = express.Router();

// Get messages for a user (inbox)
router.get('/', async (req, res) => {
  const { email, type } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    let query = supabase
      .from('messages')
      .select('*')
      .eq('receiver_email', email.toLowerCase())
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('message_type', type);
    }

    const { data, error } = await query;

    if (error) throw error;

    const parsed = data.map((m) => ({
      id: m.id,
      senderEmail: m.sender_email,
      senderName: m.sender_name,
      receiverEmail: m.receiver_email,
      subject: m.subject,
      message: m.message,
      attachmentUrl: m.attachment_url,
      isRead: m.is_read,
      messageType: m.message_type,
      createdAt: m.created_at
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get sent messages
router.get('/sent/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_email', email.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const parsed = data.map((m) => ({
      id: m.id,
      senderEmail: m.sender_email,
      senderName: m.sender_name,
      receiverEmail: m.receiver_email,
      subject: m.subject,
      message: m.message,
      attachmentUrl: m.attachment_url,
      isRead: m.is_read,
      messageType: m.message_type,
      createdAt: m.created_at
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch sent messages' });
  }
});

// Send message
router.post('/', async (req, res) => {
  const { senderEmail, senderName, receiverEmail, subject, message, messageType } = req.body;

  if (!senderEmail || !senderName || !receiverEmail || !message) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_email: senderEmail.toLowerCase(),
        sender_name: senderName,
        receiver_email: receiverEmail.toLowerCase(),
        subject: subject || 'No Subject',
        message: message,
        message_type: messageType || 'customer_support'
      }])
      .select();

    if (error) throw error;

    // Create notification for receiver
    const notificationMessage = `New message from ${senderName}: ${subject || 'No Subject'}`;
    await supabase
      .from('notifications')
      .insert([{
        user_email: receiverEmail.toLowerCase(),
        title: 'New Message',
        message: notificationMessage,
        type: 'message',
        action_url: '/messages'
      }]);

    res.status(201).json({ message: 'Message sent successfully', data: data[0] });
  } catch (err) {
    console.error('Send error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.put('/:id/read', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Message ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({ message: 'Message marked as read', data: data[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Delete message
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Message ID required' });
  }

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
