import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { API_URL } from '../utils/api';
import './Login.css';
import './ForgotPassword.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check your inbox 📫"
        subtitle="Password reset OTP sent"
        rightPaneImage="/logo1.png"
        rightPaneText={<>Get back on track with<br/><span className="highlight">College Sahayak</span></>}
      >
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={40} className="success-icon" />
          </div>
          <div className="success-text">
            <p className="primary">
              We've sent a 6-digit OTP to <br/>
              <span className="highlight">{email}</span>
            </p>
            <p className="secondary">
              Check your email and enter the OTP on the next screen to set a new password. The OTP will expire in 15 minutes.
            </p>
          </div>
          <div className="success-tip">
            <strong>Tip:</strong> If you don't see it, check your <strong>spam or junk folder</strong>.
          </div>
          <button
            type="button"
            onClick={() => navigate('/reset-password', { state: { email } })}
            className="btn btn-primary auth-submit mt-4"
          >
            Enter OTP to Reset Password
          </button>
          <div className="back-link-wrapper" style={{ marginTop: '2rem' }}>
            <button onClick={() => { setSent(false); setEmail(''); }} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <ArrowLeft size={16} />
              Try a different email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Don't worry! It happens. Please enter the email associated with your account."
      rightPaneImage="/logo1.png"
      rightPaneText={<>Get back on track with<br/><span className="highlight">College Sahayak</span></>}
    >
      {error && (
        <div className="auth-alert error">
          <AlertCircle className="icon" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Email Address</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="auth-input has-icon" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary auth-submit"
        >
          {isLoading ? 'Sending...' : 'Send Reset OTP'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="back-link-wrapper" style={{ marginTop: '1.5rem' }}>
        <Link to="/login" className="back-link">
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
