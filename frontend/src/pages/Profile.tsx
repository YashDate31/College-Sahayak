import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building2, Edit2, Shield, LogOut, Flame } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../utils/api';
import './Profile.css';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Local state for editable fields
  const [mobile, setMobile] = useState(localStorage.getItem('user_mobile') || 'Add mobile number');
  const [college, setCollege] = useState(localStorage.getItem('user_college') || 'Add your college');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.dispatchEvent(new Event('force-login'));
      return;
    }
    
    try {
      const decoded: any = jwtDecode(token);
      setFirebaseUser(decoded);
      
      // Fetch full user profile including points
      fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFirebaseUser((prev: any) => ({...prev, ...data}));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
        setLoading(false);
      });
      
    } catch (e) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new Event('force-login'));
    }
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Use real data or fallback
  const user = {
    firstName: firebaseUser?.name?.split(' ')[0] || firebaseUser?.displayName?.split(' ')[0] || 'Student',
    lastName: firebaseUser?.name?.split(' ')[1] || firebaseUser?.displayName?.split(' ')[1] || '',
    email: firebaseUser?.email || 'Not provided',
    role: firebaseUser?.role || 'student',
    points: firebaseUser?.points || 0,
    mobile: mobile,
    college: college
  };

  const initials = (user.firstName && user.lastName)
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : (user.email !== 'Not provided' ? user.email[0].toUpperCase() : 'U');

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings.</p>
        </div>

        <div className="profile-card">
          <div className="profile-cover"></div>
          
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {initials}
            </div>
          </div>

          <div className="profile-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 className="profile-name">
                  {user.firstName} {user.lastName}
                  <span className="profile-role-badge">{user.role}</span>
                </h2>
                <p className="profile-email">{user.email}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0056b3', fontWeight: '600', backgroundColor: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                  <Flame size={18} style={{ color: '#ef4444' }} />
                  <span>{user.points} pts</span>
                </div>
                <button 
                  className={isEditing ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}
                  style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="profile-details-grid">
              
              <div className="detail-group">
                <span className="detail-label">Full Name</span>
                <div className="detail-value">
                  <User size={18} className="detail-icon" />
                  {isEditing ? (
                    <input type="text" className="auth-input" defaultValue={`${user.firstName} ${user.lastName}`} style={{ padding: '0.25rem' }} />
                  ) : (
                    <span>{user.firstName} {user.lastName}</span>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <span className="detail-label">Email Address</span>
                <div className="detail-value">
                  <Mail size={18} className="detail-icon" />
                  <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                </div>
                {isEditing && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Email cannot be changed</span>}
              </div>

              <div className="detail-group">
                <span className="detail-label">Mobile Number</span>
                <div className="detail-value">
                  <Phone size={18} className="detail-icon" />
                  {isEditing ? (
                    <input type="tel" className="auth-input" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ padding: '0.25rem' }} />
                  ) : (
                    <span>{user.mobile !== 'Add mobile number' ? '+91 ' : ''}{user.mobile}</span>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <span className="detail-label">College / Institution</span>
                <div className="detail-value">
                  <Building2 size={18} className="detail-icon" />
                  {isEditing ? (
                    <input type="text" className="auth-input" value={college} onChange={(e) => setCollege(e.target.value)} style={{ padding: '0.25rem' }} />
                  ) : (
                    <span>{user.college}</span>
                  )}
                </div>
              </div>

            </div>

            {isEditing && (
              <div className="profile-actions">
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)' }} onClick={() => {
                  localStorage.setItem('user_mobile', mobile);
                  localStorage.setItem('user_college', college);
                  setIsEditing(false);
                  alert('Profile updated successfully!');
                }}>Save Changes</button>
              </div>
            )}
            
            {!isEditing && (
              <div className="profile-actions" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-outline btn-sm" style={{ color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }} onClick={() => navigate('/forgot-password')}>
                  <Shield size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Change Password
                </button>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.3)', marginLeft: 'auto', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
                  onClick={() => {
                    localStorage.removeItem('mock_logged_in');
                    localStorage.removeItem('auth_token');
                    window.dispatchEvent(new Event('force-login'));
                  }}
                >
                  <LogOut size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

