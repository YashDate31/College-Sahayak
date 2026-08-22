import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../utils/api';
import './Login.css';

export function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from the navigation state (passed from Register)
  const email = location.state?.email;

  useEffect(() => {
    // If someone tries to access this page directly without registering
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess('Email verified successfully! Logging you in...');
      
      // Save the custom JWT
      localStorage.setItem('auth_token', data.token);

      // Brief delay so the user can see the success message
      setTimeout(() => {
        const decoded: any = jwtDecode(data.token);
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a 6-digit code to ${email}.`}
      rightPaneImage="/logo1.png"
      rightPaneText={
        <>
          Almost there! Just verify your<br/>email to access<br/><span className="highlight">College Sahayak</span>
        </>
      }
    >
      {/* Alerts */}
      {error && (
        <div className="auth-alert error">
          <AlertCircle className="icon" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="auth-alert success" style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
          <CheckCircle className="icon" style={{ color: '#10b981' }} />
          <p>{success}</p>
        </div>
      )}

      {/* Verify OTP Form */}
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="form-group">
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>One-Time Password (OTP)</label>
          <input 
            type="text" 
            className="auth-input" 
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            style={{ 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              letterSpacing: '0.5rem', 
              padding: '1rem' 
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || otp.length < 6}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '12px' }}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Back to login</Link>
      </div>

    </AuthLayout>
  );
}
