import { BookOpen, GraduationCap, Users, Heart, Zap, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './About.css';

export function About() {
  return (
    <>
      <Helmet>
        <title>About Us | College Sahayak - MSBTE K-Scheme Study Materials</title>
        <meta name="description" content="Learn about College Sahayak, dedicated to providing MSBTE diploma students in Maharashtra with free, high-quality K-Scheme study materials, lab manuals, and microprojects." />
      </Helmet>
      <div className="about-page-wrapper">
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-badge">
              <span className="about-badge-dot"></span>
              <Sparkles size={14} />
              Our Story & Mission
            </div>
            <h1 className="about-hero-title">
              Revolutionizing <span className="text-gradient">Polytechnic</span> Education
            </h1>
            <p className="about-hero-description">
              College Sahayak is Maharashtra's fastest-growing digital academic platform. We are dedicated to providing MSBTE diploma students with a centralized, high-quality, and completely free resource hub for all their academic needs.
            </p>
          </div>
        </div>
      </section>

      {/* The Story / Founder Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-story-container">
            <div>
              <h2 className="about-section-heading">The Problem We're Solving</h2>
              <p className="about-text-p">
                For years, diploma students across Maharashtra have struggled with scattered resources. Finding the right lab manuals, tracking down previous years' question papers, and getting inspiration for micro-projects meant scouring dozens of unorganized websites and WhatsApp groups.
              </p>
              <p className="about-text-p" style={{ marginBottom: 0 }}>
                We realized that students were spending more time searching for study materials than actually studying. The lack of a centralized platform was not just an inconvenience; it was a barrier to academic excellence.
              </p>
            </div>

            <div className="about-founder-card">
              <div className="about-founder-bg-icon">
                <GraduationCap size={140} />
              </div>
              <h2 className="about-founder-title">Meet the Founder</h2>
              <p className="about-founder-text">
                College Sahayak was founded and developed by <strong>Yash Vijay Date</strong>, a passionate developer who experienced these academic hurdles first-hand. Recognizing the gap in digital infrastructure for MSBTE colleges, Yash set out to build a platform that wasn't just functional, but beautiful, lightning-fast, and accessible to every student.
              </p>
              <p className="about-founder-text">
                Driven by the belief that high-quality education should be accessible and organized, Yash engineered College Sahayak from the ground up, integrating modern web technologies, AI study assistance, and verified curriculum resources to empower students across Maharashtra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-values-header">
            <h2 className="about-section-heading">Our Core Values</h2>
            <p className="about-text-p" style={{ margin: '0 auto', maxWidth: '600px' }}>
              The principles that drive everything we build at College Sahayak.
            </p>
          </div>
          
          <div className="about-values-grid">
            
            <div className="about-value-card">
              <div className="about-value-icon" style={{ backgroundColor: 'rgba(30, 58, 138, 0.1)', color: '#1e3a8a' }}>
                <BookOpen size={26} />
              </div>
              <h3 className="about-value-title">Comprehensive Resources</h3>
              <p className="about-value-desc">
                We meticulously organize thousands of lab manuals, micro-projects, question papers, and curriculum guides by branch and semester so you never have to search twice.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon" style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>
                <Zap size={26} />
              </div>
              <h3 className="about-value-title">Lightning Fast</h3>
              <p className="about-value-desc">
                Time is precious during exams. Built on modern React and Node.js technologies, College Sahayak ensures instant page loads and seamless document access with zero lag.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' }}>
                <Users size={26} />
              </div>
              <h3 className="about-value-title">Community Driven</h3>
              <p className="about-value-desc">
                Education thrives on collaboration. We empower diploma students and faculty to contribute study materials, projects, and solved notes to support peers statewide.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
                <Heart size={26} />
              </div>
              <h3 className="about-value-title">Free Forever</h3>
              <p className="about-value-desc">
                We strongly believe that access to essential educational resources should never come with a paywall. Our core materials will always remain 100% free for all students.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="about-stats-glow-1"></div>
        <div className="about-stats-glow-2"></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="about-stats-header">
            <h2 className="about-stats-title">Our Impact So Far</h2>
            <p className="about-stats-sub">
              Empowering diploma engineering students across Maharashtra every single day.
            </p>
          </div>
          
          <div className="about-stats-grid">
            
            <div className="about-stat-card">
              <div className="about-stat-number">10k+</div>
              <div className="about-stat-label" style={{ color: '#fbbf24' }}>Active Students</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-number">500+</div>
              <div className="about-stat-label" style={{ color: '#4ade80' }}>Lab Manuals</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-number">1.2k</div>
              <div className="about-stat-label" style={{ color: '#93c5fd' }}>Micro Projects</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-number">30+</div>
              <div className="about-stat-label" style={{ color: '#fca5a5' }}>Colleges Linked</div>
            </div>

          </div>
        </div>
      </section>

    </div>
    </>
  );
}
