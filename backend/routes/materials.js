const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const verifyAuth = require('../middleware/auth');

router.get('/', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch materials' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admins upload directly; students get a [PENDING] prefix for moderation
router.post('/', verifyAuth, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { title, description, category, branch, semester, driveLink, imageLink, subjectCode } = req.body;

  if (!title || !category || !driveLink || !subjectCode) {
    return res.status(400).json({ error: 'Title, category, driveLink, and subjectCode are required fields' });
  }

  // If the uploader is NOT the admin, prefix title with [PENDING][by:email] for user isolation and moderation
  const uploaderEmail = req.user?.email || 'student';
  const finalTitle = req.isAdmin ? title : `[PENDING][by:${uploaderEmail}] ${title}`;

  try {
    const { data, error } = await supabase
      .from('materials')
      .insert([
        {
          title: finalTitle,
          description,
          category,
          branch,
          semester,
          subject_code: subjectCode,
          drive_link: driveLink,
          image_link: imageLink,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to add material to database' });
    }

    res.status(201).json({ message: 'Material added successfully', data: data[0] });
  } catch (err) {
    console.error('Error adding material:', err);
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
    const { data, error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete material' });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Material not found' });
    }

    res.status(200).json({ message: 'Material deleted successfully', data: data[0] });
  } catch (err) {
    console.error('Error deleting material:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// This strips the [PENDING] prefix and makes the material visible to all students
router.put('/:id/approve', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { id } = req.params;
  const { title } = req.body;

  try {
    // Extract email if present
    const emailMatch = title.match(/\[by:(.*?)\]/i);
    const uploaderEmail = emailMatch ? emailMatch[1] : null;

    // Remove [PENDING] and optional [by:email] prefix from title to publish it
    const newTitle = title.replace(/^\[PENDING\](\[by:.*?\])?\s*/i, '');

    const { data, error } = await supabase
      .from('materials')
      .update({ title: newTitle })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to approve material' });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Material not found' });
    }

    // Award 10 points to the uploader if an email was found
    if (uploaderEmail) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, points')
        .eq('email', uploaderEmail)
        .single();
        
      if (!userError && userData) {
        const currentPoints = userData.points || 0;
        await supabase
          .from('users')
          .update({ points: currentPoints + 10 })
          .eq('id', userData.id);
      }
    }

    res.status(200).json({ message: 'Material approved successfully. Uploader awarded 10 points.', data: data[0] });
  } catch (err) {
    console.error('Error approving material:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/trending', verifyAuth, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { id } = req.params;
  const { is_trending } = req.body;

  try {
    const { data, error } = await supabase
      .from('materials')
      .update({ is_trending: is_trending })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase trending update error:', error);
      // Common cause: the is_trending column doesn't exist yet.
      if (error.message && error.message.includes('column')) {
        return res.status(500).json({ error: 'Database column "is_trending" is missing. Run: ALTER TABLE materials ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE; in Supabase SQL Editor.' });
      }
      return res.status(500).json({ error: 'Failed to update trending status: ' + error.message });
    }

    res.status(200).json({ message: 'Trending status updated', data: data[0] });
  } catch (err) {
    console.error('Error updating trending status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
