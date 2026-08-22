import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  rightPaneImage: string;
  rightPaneText: ReactNode;
}

export function AuthLayout({ children, title, subtitle, rightPaneImage, rightPaneText }: AuthLayoutProps) {
  return (
    <div className="auth-layout-wrapper">
      <div className="auth-card">
        
        {/* Left Panel (Form Area) */}
        <div className="auth-left-pane">
          <div className="auth-form-container">
            
            {/* Top Logo */}
            <Link to="/" className="auth-brand">
              <div className="auth-logo-icon">
                <BookOpen size={32} strokeWidth={1.5} />
                <div className="auth-logo-overlay">
                  <GraduationCap size={20} strokeWidth={2} />
                </div>
              </div>
              <div className="auth-brand-text-container">
                <h1 className="auth-brand-title">College Sahayak</h1>
                <p className="auth-brand-subtitle">Your Campus. Simplified.</p>
              </div>
            </Link>

            {/* Header */}
            <div className="auth-header animate-fade-in">
              <h2 className="auth-title">{title}</h2>
              <p className="auth-subtitle">{subtitle}</p>
            </div>

            {/* Form Slot */}
            <div className="auth-form-slot animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {children}
            </div>
          </div>
        </div>

        {/* Right Panel (Illustration Area) */}
        <div className="auth-right-pane desktop-only">
          <div className="auth-illustration-box">
            
            {/* Illustration */}
            <div className="auth-illustration floating">
              <img src={rightPaneImage} alt="Illustration" />
            </div>

            {/* Carousel Dots */}
            <div className="auth-carousel-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>

            {/* Footer Text */}
            <div className="auth-right-text">
              <h3>{rightPaneText}</h3>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
