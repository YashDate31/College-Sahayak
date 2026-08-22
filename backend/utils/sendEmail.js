const https = require('https');
const nodemailer = require('nodemailer');
const sendViaBrevoAPI = (to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    if (!apiKey) {
      reject(new Error('BREVO_API_KEY not set'));
      return;
    }

    const body = JSON.stringify({
      sender: { name: 'College Sahayak', email: 'collegesahayak@gmail.com' },
      to: [{ email: to }],
      subject,
      htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          reject(new Error(`Brevo API error (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
};
const sendViaNodemailer = async (to, subject, htmlContent) => {
  const user = process.env.EMAIL_USER || 'collegesahayak@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('EMAIL_USER or EMAIL_PASS not configured');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  await transporter.sendMail({
    from: `"College Sahayak" <${user}>`,
    to,
    subject,
    html: htmlContent
  });

  return true;
};

// Universal Email Dispatcher with Multi-Tier Fallback
const sendEmail = async (to, subject, htmlContent) => {
  // Tier 1: Brevo REST API (if valid API key is present)
  try {
    const brevoKey = (process.env.BREVO_API_KEY || '').trim();
    if (brevoKey && brevoKey.startsWith('xkeysib-')) {
      await sendViaBrevoAPI(to, subject, htmlContent);
      console.log(`✉️ Email sent to ${to} via Brevo API`);
      return true;
    }
  } catch (err) {
    console.warn(`⚠️ Brevo API delivery failed: ${err.message}. Trying Gmail SMTP fallback...`);
  }

  // Tier 2: Gmail / Primary SMTP Transporter
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendViaNodemailer(to, subject, htmlContent);
      console.log(`✉️ Email sent to ${to} via SMTP Transporter`);
      return true;
    }
  } catch (err) {
    console.error(`❌ SMTP Transporter delivery failed: ${err.message}`);
  }

  // Tier 3: Direct Brevo API Attempt if key exists
  try {
    if (process.env.BREVO_API_KEY) {
      await sendViaBrevoAPI(to, subject, htmlContent);
      console.log(`✉️ Email sent to ${to} via Brevo API`);
      return true;
    }
  } catch (err) {
    console.warn(`⚠️ Brevo API attempt failed: ${err.message}`);
  }

  return false;
};

// Send OTP helper function
const sendOTP = async (to, otp) => {
  console.log('==================================================');
  console.log(`🔑 OTP for ${to}: ${otp}`);
  console.log('==================================================');

  const subject = 'Verify your College Sahayak account';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #1e3a8a; text-align: center;">College Sahayak</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Thank you for registering! Please use the following One-Time Password (OTP) to verify your account.</p>
      <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px; color: #d97706;">${otp}</h1>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">College Sahayak — Your Campus, Simplified.</p>
    </div>
  `;

  return await sendEmail(to, subject, htmlContent);
};

// Send Feedback Email helper function
const sendFeedbackEmail = async (feedbackType, message, userEmail) => {
  const subject = `New Feedback: ${feedbackType}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      ### New Feedback Received
      <p><strong>Type:</strong> ${feedbackType}</p>
      <p><strong>From:</strong> ${userEmail}</p>
      <hr />
      <p>${message}</p>
    </div>
  `;

  return await sendEmail('yashdate31@gmail.com', subject, htmlContent);
};

module.exports = { sendOTP, sendFeedbackEmail };
