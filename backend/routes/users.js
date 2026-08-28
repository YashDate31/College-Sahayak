const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const verifyTokenOnly = require('../middleware/authVerifyOnly');
const verifyAuth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-me-in-production';

router.post('/sync', verifyTokenOnly, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { uid, email, name, picture, email_verified } = req.user;

  if (email_verified === false) {
    return res.status(403).json({ error: 'Please verify your Google account email before logging in.' });
  }

  try {

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means zero rows returned
      console.error('Supabase check user error:', checkError);
      return res.status(500).json({ error: 'Database error checking user' });
    }

    let userToSign;

    if (existingUser) {
      // User exists, just update their info if needed (e.g. name changed)
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ email, name: name || existingUser.name })
        .eq('firebase_uid', uid)
        .select();
        
      if (updateError) throw updateError;
      userToSign = data[0];
    } else {
      // New user
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            firebase_uid: uid,
            email: email,
            name: name || '',
            role: 'user'
          },
        ])
        .select();

      if (insertError) throw insertError;
      userToSign = data[0];
    }

    // Generate custom JWT token
    const token = jwt.sign(
      { 
        id: userToSign.id,
        email: userToSign.email,
        name: userToSign.name,
        role: userToSign.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ 
      message: 'User synced successfully', 
      token,
      user: {
        id: userToSign.id,
        email: userToSign.email,
        name: userToSign.name
      }
    });
  } catch (err) {
    console.error('Error syncing user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, points')
      .order('points', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Supabase fetch leaderboard error:', error);
      return res.status(500).json({ error: 'Database error fetching leaderboard' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', verifyAuth, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, email, role, points')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Supabase fetch user error:', error);
      return res.status(500).json({ error: 'Database error fetching user' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
