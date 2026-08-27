const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../utils/sendEmail');
const supabase = require('../config/supabase');
const verifyAuth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { type, message, email } = req.body;

  if (!type || !message || !email) {
    return res.status(400).json({ error: 'Type, message, and email are required' });
  }

  try {

    const emailSuccess = await sendFeedbackEmail(type, message, email);

    let dbSuccess = false;
    if (supabase) {
      const { error } = await supabase
        .from('feedback')
        .insert([{ type, message, email, status: 'unread' }]);
        
      if (!error) {
        dbSuccess = true;
      } else {
        console.error('Supabase feedback insert error:', error);
      }
    }

    if (emailSuccess || dbSuccess) {
      res.status(200).json({ message: 'Feedback sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send or store feedback' });
    }
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my', verifyAuth, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('email', req.user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch my feedback error:', error);
      return res.status(500).json({ error: 'Failed to fetch your feedback' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching my feedback:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/read', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { id } = req.params;
  const { status } = req.body; // should be 'read' or 'unread'

  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({ status: status || 'read' })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to update status' });
    }

    res.status(200).json({ message: 'Status updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/reply', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({ error: 'Reply content is required' });
  }

  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({ 
        reply: reply, 
        status: 'replied',
        replied_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase reply update error:', error);
      return res.status(500).json({ error: 'Failed to save reply. Ensure you have added the reply column in Supabase.' });
    }

    res.status(200).json({ message: 'Reply sent successfully', data: data[0] });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
