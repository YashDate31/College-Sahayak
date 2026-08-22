const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/sendEmail');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-me-in-production';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many OTP attempts from this IP, please try again after 15 minutes' }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/register', authLimiter, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {

      if (existingUser.is_verified === false) {
        const newOtp = generateOTP();
        const newExpiry = new Date();
        newExpiry.setMinutes(newExpiry.getMinutes() + 10);

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await supabase
          .from('users')
          .update({ otp_code: newOtp, otp_expiry: newExpiry.toISOString(), name, password_hash })
          .eq('email', email);

        await sendOTP(email, newOtp);

        return res.status(201).json({
          message: 'A new OTP has been sent to your email. Please verify your account.',
          requireVerification: true
        });
      }

      return res.status(400).json({ error: 'User with this email already exists' });
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Supabase check error:', checkError);
      return res.status(500).json({ error: 'Database error while checking user' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          firebase_uid: `custom_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          email,
          name,
          password_hash,
          role: 'user',
          is_verified: false,
          otp_code: otp,
          otp_expiry: otpExpiry.toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert user error:', insertError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    await sendOTP(email, otp);

    res.status(201).json({
      message: 'Registration initiated. Please verify your email.',
      requireVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', otpLimiter, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please register again.' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
        otp_code: null,
        otp_expiry: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update verified error:', updateError);
      return res.status(500).json({ error: 'Failed to verify user' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Verification successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Please log in with Google, or reset your password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.is_verified === false) {
      return res.status(403).json({ error: 'Please verify your email before logging in. Check your email for the OTP.' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {

      return res.status(200).json({ message: 'If that email exists, we have sent a reset link.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    const { error: updateError } = await supabase
      .from('users')
      .update({ otp_code: otp, otp_expiry: otpExpiry.toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update OTP error:', updateError);
      return res.status(500).json({ error: 'Failed to process request' });
    }

    const emailSent = await sendOTP(email, otp);
    
    if (!emailSent) {

      await supabase.from('users').update({ is_verified: true }).eq('email', email);
    }

    res.status(200).json({ message: 'If that email exists, we have sent a reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new password reset.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash, otp_code: null, otp_expiry: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update password error:', updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/check-role', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ 
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      message: decoded.role === 'admin' ? '✅ Admin role confirmed' : '❌ NOT admin - role is: ' + decoded.role
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token: ' + err.message });
  }
});

router.post('/make-admin', async (req, res) => {
  const { email, secretKey } = req.body;
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'college-sahayak-admin-2026';

  if (secretKey !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Invalid secret key' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not initialized' });
  }

  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !user) {
      return res.status(404).json({ error: 'User not found with that email' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', email);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update role: ' + updateError.message });
    }

    // Generate new JWT with admin role
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: `✅ User ${email} is now an admin! Use the token to login.`,
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

module.exports = router;
