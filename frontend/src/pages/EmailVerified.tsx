import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export function EmailVerified() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return (
      <AuthLayout title="Verifying your email…" subtitle="Please wait" rightPaneImage="/logo1.png" rightPaneText={<>Setting up your account</>}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 0' }}>
          <Loader size={40} className="spinner" style={{ color: 'var(--primary-color)' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Confirming your email address…</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'error') {
    return (
      <AuthLayout title="Verification failed" subtitle="Something went wrong" rightPaneImage="/logo1.png" rightPaneText={<>Oops! Let's try again</>}>
        <div className="success-card">
          <div className="success-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)' }}>
            <AlertCircle size={40} style={{ color: 'var(--danger-color)' }} />
          </div>
          <div className="success-text">
            <p className="primary">Email verification failed</p>
            <p className="secondary">{errorMessage || 'The verification link may have expired.'}</p>
          </div>
          <Link
            to="/register"
            className="btn-primary auth-submit mt-4 group"
            style={{ textDecoration: 'none' }}
          >
            Register Again
            <ArrowRight size={18} className="arrow-icon" />
          </Link>
          <div className="back-link-wrapper mt-4">
            <Link to="/login" className="back-link">Back to Sign In</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Email verified! 🎉"
      subtitle="Your account is ready to use"
      rightPaneImage="/logo1.png"
      rightPaneText={<>Welcome to<br/><span className="highlight">College Sahayak</span></>}
    >
      <div className="success-card">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={40} className="success-icon" />
        </div>
        <div className="success-text">
          <p className="primary">Account verified successfully!</p>
          <p className="secondary">Welcome to College Sahayak. You now have access to thousands of study materials, lab manuals, and more.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary auth-submit mt-4 group"
        >
          Start Learning
          <ArrowRight size={18} className="arrow-icon" />
        </button>
      </div>
    </AuthLayout>
  );
}
