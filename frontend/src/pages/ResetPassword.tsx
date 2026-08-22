import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { API_URL } from '../utils/api';
import './Login.css'; // Reusing base auth styles
import './ResetPassword.css';

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score === 0 || password.length === 0) return { level: 0, label: '', color: '' };
  if (score === 1) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { level: 2, label: 'Fair', color: '#f97316' };
  if (score === 3) return { level: 3, label: 'Good', color: '#eab308' };
  return { level: 4, label: 'Strong', color: '#22c55e' };
}

const strengthWidths = ['0%', '25%', '50%', '75%', '100%'];
const strengthColors = ['', 'var(--danger-color)', 'var(--warning-color)', 'var(--warning-color)', 'var(--success-color)'];

export function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (strength.level < 2) {
      setError('Please choose a stronger password (mix uppercase, numbers, and symbols).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Reset!"
        subtitle="Your password has been successfully updated."
        rightPaneImage="/logo1.png"
        rightPaneText={<>Get back on track with<br/><span className="highlight">College Sahayak</span></>}
      >
        <div className="success-card" style={{ marginTop: '2rem' }}>
          <div className="success-icon-wrapper">
            <CheckCircle2 size={40} className="success-icon" />
          </div>
          <div className="success-text">
            <p className="primary">You're all set!</p>
            <p className="secondary">
              Your password has been changed successfully. You can now use your new password to log in to your account.
            </p>
          </div>
          <Link to="/login" className="btn btn-primary auth-submit mt-4" style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle={`Enter the 6-digit OTP sent to ${email} and your new password.`}
      rightPaneImage="/logo1.png"
      rightPaneText={<>Get back on track with<br/><span className="highlight">College Sahayak</span></>}
    >
      {error && (
        <div className="auth-alert error">
          <AlertCircle className="icon" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
        
        {/* OTP Input */}
        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>6-Digit OTP</label>
          <div className="input-with-icon">
            <KeyRound className="input-icon" size={18} />
            <input 
              type="text"
              maxLength={6}
              className="auth-input has-icon" 
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ letterSpacing: '2px', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>New Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              className="auth-input has-icon" 
              placeholder="Create a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="password-strength-container mt-2">
              <div className="strength-bar-bg">
                <div 
                  className="strength-bar-fill" 
                  style={{ 
                    width: strengthWidths[strength.level],
                    backgroundColor: strengthColors[strength.level]
                  }}
                ></div>
              </div>
              <div className="strength-text" style={{ color: strengthColors[strength.level] }}>
                <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                {strength.label}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Confirm Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="auth-input has-icon" 
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary auth-submit"
          style={{ marginTop: '0.5rem' }}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}
