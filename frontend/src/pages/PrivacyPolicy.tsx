import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy - College Sahayak</title>
        <meta name="description" content="Privacy Policy for College Sahayak. Learn how we collect, use, and protect your data." />
      </Helmet>
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Last updated: August 2026</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.7', color: '#334155' }}>
          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>1. Introduction</h2>
            <p>Welcome to College Sahayak. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>2. The Data We Collect About You</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., creating your account).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>4. Cookies</h2>
            <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly. We use cookies primarily for authentication (Firebase Auth) and remembering your preferences.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>5. Third-Party Services</h2>
            <p>We use Google Firebase for authentication and database services (Supabase). These services have their own privacy policies regarding how they handle your data.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '0.75rem' }}>6. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at support@internship-2k26.vercel.app.</p>
          </section>
        </div>
      </div>
    </>
  );
}
