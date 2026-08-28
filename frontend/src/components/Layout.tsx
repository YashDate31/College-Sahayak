import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, LogIn, Menu, MessageSquare, User, X, Search } from 'lucide-react';
import { CookieBanner } from './CookieBanner';
import { Chatbot } from './Chatbot';
import { NotificationBell } from './NotificationBell';
import { SearchModal } from './SearchModal';
import './Layout.css';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Curriculum', to: '/curriculum', icon: GraduationCap },
  { label: 'Resources', to: '/lab-manuals', icon: BookOpen },
  { label: 'My Documents', to: '/my-reports' },
  { label: 'About Us', to: '/about', icon: User },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`brand ${inverse ? 'brand-inverse' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <div className="brand-logo-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e3a8a' }}>
        <BookOpen className="brand-book-icon" strokeWidth={1.5} />
        <div style={{ position: 'absolute', top: 0, color: '#d97706' }}>
          <GraduationCap className="brand-cap-icon" strokeWidth={2} />
        </div>
      </div>
      <span className="brand-text" style={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>College Sahayak</span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="layout-wrapper">
      <header className="header">
        <nav className="navbar container">
          <Brand />

          <div className="nav-links desktop-only" style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setSearchOpen(true)}
              className="nav-link search-btn-desktop"
              title="Search (Ctrl+K)"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', color: '#475569' }}
            >
              <Search size={18} />
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to && item.to !== '/';
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Conditional Auth Links */}
            {localStorage.getItem('auth_token') ? (
              <>
                <Link to="/profile" className="nav-link">
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <NotificationBell />
              </>
            ) : (
              <Link to="/login" className="nav-link login-link">
                <LogIn size={16} />
                <span>Login/Register</span>
              </Link>
            )}

            <Link to="/feedback" className="btn btn-primary feedback-btn">
              <MessageSquare size={16} />
              <span>Feedback</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button 
              className="mobile-menu-btn desktop-hidden"
              onClick={() => setSearchOpen(true)}
              style={{ color: '#475569', padding: '0.25rem' }}
            >
              <Search size={20} />
            </button>
            <div className="desktop-hidden" style={{ padding: '0.25rem' }}>
              <NotificationBell />
            </div>
            <button
              className="mobile-menu-btn desktop-hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ padding: '0.25rem' }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu desktop-hidden animate-fade-in">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Conditional Mobile Auth Links */}
            {localStorage.getItem('auth_token') ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                {/* On mobile we render a simple link for notifications, or maybe NotificationBell handles itself better via fixed position. We'll just show it in the header for mobile, wait, NotificationBell is in .desktop-only. Let's make it visible on mobile header. */}
              </>
            ) : (
              <Link
                to="/login"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Login/Register
              </Link>
            )}
            <Link to="/feedback" className="mobile-nav-link feedback-mobile" onClick={() => setMenuOpen(false)}>
              Feedback
            </Link>
          </div>
        )}
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-container container">
          <div className="footer-col brand-col">
            <Brand inverse />
            <p className="footer-desc">
              Empowering polytechnic diploma students across Maharashtra with study materials, practicals, and academic resources.
            </p>
          </div>
          <div className="footer-col links-col">
            <h3>Essential Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/curriculum">MSBTE Curriculum</Link></li>
              <li><Link to="/lab-manuals">All Resources</Link></li>
              <li><Link to="/question-papers">Question Papers</Link></li>
            </ul>
          </div>
          <div className="footer-col contact-col">
            <h3>Connect With Us</h3>
            <p className="footer-desc">Follow updates, study tips, and educational content from College Sahayak.</p>
            <div className="contact-info">
              <p>Maharashtra, India</p>
              <p>collegesahayak@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} College Sahayak. All Rights Reserved. | <Link to="/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </footer>

      <CookieBanner />
      <Chatbot />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
