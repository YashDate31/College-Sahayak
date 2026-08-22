import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import './CookieBanner.css';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay to make the entrance feel smoother
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleSettings = () => {
    // For now, this just accepts necessary, but in a real app would open a modal
    localStorage.setItem('cookie_consent', 'settings_saved');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-overlay animate-fade-in">
      <div className="cookie-modal animate-slide-up">
        <div className="cookie-header">
          <div className="brand-logo">
            <ShieldAlert size={28} className="shield-icon" />
            <h2>College Sahayak values your privacy</h2>
          </div>
        </div>
        
        <div className="cookie-body">
          <p>
            We and our third-party vendors use technologies (e.g. cookies) to store and/or access information on user's devices in order to process personal data such as IP addresses or browsing data. You may consent to the processing of your personal data for the listed purposes below.
          </p>
          <p>
            Alternatively, you can set your preferences before consenting or refuse to consent. Your privacy choices are only applicable on this digital property where you have made your choices.
          </p>
          <div className="cookie-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/privacy-policy">Imprint</a>
            <a href="/privacy-policy">Vendor list</a>
          </div>
        </div>

        <div className="cookie-footer">
          <p className="purposes-label">Purposes</p>
          <div className="cookie-buttons">
            <button className="btn btn-outline" onClick={handleSettings}>Settings</button>
            <button className="btn btn-primary" onClick={handleAcceptAll}>Accept all</button>
          </div>
          <div className="cookie-powered">
            Powered by SecureConsent Management
          </div>
        </div>
      </div>
    </div>
  );
}
