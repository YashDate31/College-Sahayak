import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, AlertCircle, Loader2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Mock checking auth
  const isLoggedIn = localStorage.getItem('mock_logged_in') === 'true';

  if (!isOpen) return null;

  const resetState = () => {
    setUtr('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || utr.length < 12) {
      setError('Please enter a valid 12-digit UTR number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 4000);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Login Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please log in to upgrade to Premium.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={handleClose}>Close</button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
        
        {/* Left Side: Benefits */}
        <div style={{ background: 'var(--gradient-primary)', padding: '2.5rem', color: 'white', width: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Semester Pass</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Unlock all premium study materials instantly.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <ShieldCheck size={20} style={{ color: 'rgba(255,255,255,0.7)', marginRight: '0.75rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem' }}>Verified, high-quality Lab Manuals & Microprojects.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Zap size={20} style={{ color: 'rgba(255,255,255,0.7)', marginRight: '0.75rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem' }}>Instant access to fully solved Question Papers.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: 'rgba(255,255,255,0.7)', marginRight: '0.75rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem' }}>One-time payment. Valid for the entire semester.</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>₹149</p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>One-time payment</p>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div style={{ padding: '2.5rem', width: '55%', position: 'relative' }}>
          <button
            onClick={handleClose}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.5rem' }}
          >
            <X size={20} />
          </button>

          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ marginBottom: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--success-color)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Payment Submitted!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Your UTR number has been received. Admin will verify it shortly. You'll have premium access once verified!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Pay via UPI</h3>
              
              {/* Fake QR Code Area */}
              <div style={{ background: 'var(--bg-color)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <QrCode size={64} style={{ color: 'var(--text-tertiary)', marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: 600 }}>Scan via GPay / PhonePe / Paytm</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>UPI ID: collegesahayak@ybl</p>
              </div>

              {error && (
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', padding: '0.75rem', color: '#b91c1c', fontSize: '0.875rem' }}>
                  <AlertCircle size={16} style={{ marginRight: '0.5rem', marginTop: '0.125rem', flexShrink: 0 }} />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ marginTop: 'auto' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    Enter UTR / Reference Number
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 312345678901"
                    maxLength={12}
                    className="auth-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>The 12-digit transaction ID from your UPI app.</p>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600, justifyContent: 'center' }}
                  disabled={isSubmitting || utr.length < 12}
                >
                  {isSubmitting ? (
                    <><Loader2 size={20} style={{ marginRight: '0.5rem' }} className="spinner" /> Verifying...</>
                  ) : (
                    'Submit Payment'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
