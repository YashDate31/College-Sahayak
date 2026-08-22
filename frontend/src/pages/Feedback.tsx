import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { API_URL } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import './Login.css'; // For .auth-input and .form-group

export function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.email) {
          setEmail(decoded.email);
        }
      }
    } catch (e) {
      // ignore decoding errors
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: feedbackType, message, email })
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: 'calc(100vh - 72px)',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--surface-color)',
    padding: '3rem 2.5rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    width: '100%',
    maxWidth: '550px'
  };

  if (submitted) {
    return (
      <div style={containerStyle}>
        <div className="animate-fade-in" style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success-color)' }}>
            <CheckCircle size={64} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your feedback helps us make College Sahayak better for everyone. We appreciate your time!
          </p>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.location.href = '/'}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="animate-fade-in" style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary-light)', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            <MessageSquare size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Share Your Feedback</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Help us improve College Sahayak. Need a new feature? Found a bug? Let us know!</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && <div style={{ color: 'var(--danger-color)', textAlign: 'center', marginBottom: '0.5rem' }}>{error}</div>}

          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Feedback Type</label>
            <select 
              className="auth-input" 
              required 
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <option value="suggestion">Feature Suggestion</option>
              <option value="content">Request Study Material</option>
              <option value="bug">Report a Bug</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Your Message</label>
            <textarea 
              className="auth-input" 
              rows={5} 
              required 
              placeholder="Tell us exactly what you're looking for or what's on your mind..."
              style={{ resize: 'vertical' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Email</label>
            <input 
              type="email" 
              className="auth-input" 
              placeholder="Your email address"
              required
              value={email}
              readOnly={true}
              style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'var(--bg-color)' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            <Send size={18} />
            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
