const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const verifyAuth = require('../middleware/auth');

// GET all active notices (public or auth depending on need, we'll use auth)
router.get('/', verifyAuth, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch notices error:', error);
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new notice (Admin only)
router.post('/', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const { data, error } = await supabase
      .from('notices')
      .insert([{ title, content }])
      .select();

    if (error) {
      console.error('Supabase notice insert error:', error);
      return res.status(500).json({ error: 'Failed to create notice. Ensure the notices table exists.' });
    }

    res.status(201).json({ message: 'Notice created successfully', data: data[0] });
  } catch (error) {
    console.error('Notice creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a notice (Admin only)
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
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete notice' });
    }

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
