import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Building2, AlertCircle, GraduationCap, BookOpen, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import './Login.css';
import './Register.css'; // Reusing terms group and checkbox styles if needed

type UserRole = 'student' | 'teacher' | 'visitor';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student', description: 'Diploma student at an MSBTE college', icon: GraduationCap, color: 'var(--primary-color)' },
  { value: 'teacher', label: 'Teacher', description: 'Faculty member or lecturer', icon: BookOpen, color: '#764ba2' },
  { value: 'visitor', label: 'Visitor', description: 'General visitor / alumni', icon: UserCheck, color: '#06b6d4' },
];

export function CompleteProfile() {
  const [role, setRole] = useState<UserRole>('student');
  const [mobileNumber, setMobileNumber] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const isVisitor = role === 'visitor';

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!isVisitor) {
      if (!mobileNumber) errors.mobile_number = 'Mobile number is required';
      else if (!/^[6-9]\d{9}$/.test(mobileNumber)) errors.mobile_number = 'Enter a valid 10-digit mobile number';
      if (!collegeName.trim()) errors.college_name = 'College / institution name is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <AuthLayout
      title="Welcome! 👋"
      subtitle="Complete your profile to get started"
      rightPaneImage="/logo1.png"
      rightPaneText={<>Just a few more details to<br/><span className="highlight">personalize</span> your experience.</>}
    >
      <div className="auth-alert" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid rgba(37,99,235,0.2)', marginBottom: '1.5rem' }}>
        <CheckCircle2 className="icon" style={{ color: 'var(--primary-color)' }} />
        <div>
          <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Google sign-in successful!</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 400 }}>Just a few more details to personalize your experience.</p>
        </div>
      </div>

      {error && (
        <div className="auth-alert error">
          <AlertCircle className="icon" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Role selector */}
        <div className="form-group mb-4">
          <label className="auth-label">I am a</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const selected = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setRole(opt.value as UserRole); setFieldErrors({}); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    padding: '1rem 0.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    border: `2px solid ${selected ? opt.color : 'var(--border-color)'}`,
                    backgroundColor: selected ? `${opt.color}10` : 'var(--surface-color)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={24} style={{ color: selected ? opt.color : 'var(--text-tertiary)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selected ? opt.color : 'var(--text-secondary)' }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '0.5rem' }}>
            {ROLE_OPTIONS.find((o) => o.value === role)?.description}
          </p>
        </div>

        {!isVisitor && (
          <>
            <div className="form-group mb-4">
              <label htmlFor="complete-mobile" className="auth-label">Mobile Number</label>
              <div className="input-wrapper mt-1">
                <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, top: '50%', transform: 'translateY(-50%)' }}>+91</span>
                <div style={{ position: 'absolute', left: '3rem', width: '1px', height: '1.25rem', backgroundColor: 'var(--border-color)', top: '50%', transform: 'translateY(-50%)' }} />
                <div className="input-icon" style={{ left: '3.5rem' }}>
                  <Phone size={16} />
                </div>
                <input
                  id="complete-mobile"
                  type="tel"
                  maxLength={10}
                  className={`auth-input ${fieldErrors.mobile_number ? 'error' : ''}`}
                  style={{ paddingLeft: '6rem' }}
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g, '')); setFieldErrors((p) => ({ ...p, mobile_number: '' })); }}
                />
              </div>
              {fieldErrors.mobile_number && <p className="field-error">{fieldErrors.mobile_number}</p>}
            </div>

            <div className="form-group mb-4">
              <label htmlFor="complete-college" className="auth-label">College / Institution</label>
              <div className="input-wrapper mt-1">
                <div className="input-icon">
                  <Building2 size={16} />
                </div>
                <input
                  id="complete-college"
                  type="text"
                  className={`auth-input ${fieldErrors.college_name ? 'error' : ''}`}
                  placeholder="Government Polytechnic, Pune"
                  value={collegeName}
                  onChange={(e) => { setCollegeName(e.target.value); setFieldErrors((p) => ({ ...p, college_name: '' })); }}
                />
              </div>
              {fieldErrors.college_name && <p className="field-error">{fieldErrors.college_name}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary auth-submit group mt-4"
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Saving profile…
            </>
          ) : (
            <>
              Complete Setup
              <ArrowRight size={18} className="arrow-icon" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
