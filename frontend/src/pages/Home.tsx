import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award, Bell, BookmarkPlus, Calendar, CheckCircle,
  ChevronRight, ClipboardList, Download, ExternalLink, FileText,
  Flame, GraduationCap, Lightbulb, MessageSquare, Settings, Shield, Star, PlayCircle, BookOpen
} from 'lucide-react';
import { handleProtectedDownload } from '../utils/auth';
import { API_URL } from '../utils/api';
import './Home.css';

// Data
const branches = [
  { id: 'CO', name: 'Computer Engineering', icon: 'CO' },
  { id: 'ME', name: 'Mechanical Engineering', icon: 'ME' },
  { id: 'EE', name: 'Electrical Engineering', icon: 'EE' },
  { id: 'CE', name: 'Civil Engineering', icon: 'CE' },
  { id: 'EJ', name: 'Electronics Engineering', icon: 'E&TC' },
  { id: 'AU', name: 'Automobile Engineering', icon: 'AU' },
];

const quickResources = [
  { name: 'MSBTE Curriculum', path: '/curriculum', icon: GraduationCap, color: 'icon-indigo', description: '691 subjects, all branches' },
  { name: 'Lab Manuals', path: '/lab-manuals', icon: Settings, color: 'icon-green', description: 'Hands-on experiments' },
  { name: 'Assignments', path: '/assignments', icon: FileText, color: 'icon-purple', description: 'Practice problems' },
  { name: 'Micro-Projects', path: '/microprojects', icon: Lightbulb, color: 'icon-orange', description: 'Project ideas' },
  { name: 'Question Papers', path: '/question-papers', icon: ClipboardList, color: 'icon-red', description: 'Previous year papers' },
  { name: 'Notes', path: '/notes', icon: BookOpen, color: 'icon-blue', description: 'Subject wise notes' },
  { name: 'Manual Answers', path: '/manual-answers', icon: CheckCircle, color: 'icon-teal', description: 'Verified manual answers' },
  { name: 'MSBTE IMP', path: '/msbte-imp', icon: Star, color: 'icon-yellow', description: 'Important questions' },
  { name: 'Lecture Videos', path: '/lecture-videos', icon: PlayCircle, color: 'icon-pink', description: 'Topic explanations' },
  { name: 'Updates', path: '/updates', icon: Bell, color: 'icon-gray', description: 'Latest announcements' },
];

interface TrendingMaterial {
  id: string;
  title: string;
  branch: string;
  semester: string;
  category: string;
  drive_link: string;
}

const officialUpdates = [
  { title: 'MSBTE Summer 2025 Exam Schedule Released', description: 'Check exam dates and prepare with the complete timetable.', type: 'Exam Schedule', date: 'Jan 15, 2025', priority: 'High' },
  { title: 'New Curriculum Updates for AY 2024-25', description: 'Updated syllabus for Computer and Electronics Engineering branches.', type: 'Curriculum', date: 'Jan 12, 2025', priority: 'Medium' },
  { title: 'Online Practical Submission Guidelines', description: 'Important instructions for submitting lab practicals online.', type: 'Guidelines', date: 'Jan 10, 2025', priority: 'High' },
];

const trustFeatures = [
  { icon: Shield, title: 'Verified & High-Quality', description: 'Materials are reviewed and organized for diploma students.', color: 'icon-green', bg: 'bg-green-light' },
  { icon: CheckCircle, title: 'Easy to Navigate', description: 'Find resources by branch and semester without confusion.', color: 'icon-indigo', bg: 'bg-indigo-light' },
  { icon: Award, title: 'Completely Free', description: 'Access study resources without any hidden cost.', color: 'icon-purple', bg: 'bg-purple-light' },
];

const reviews = [
  { name: 'Sham Dadge', branch: 'Computer Engineering', text: 'Amazing collection of notes. It helped me prepare faster for semester exams.', material: 'Java Programming Notes' },
  { name: 'Ganesh Jadhav', branch: 'Mechanical Engineering', text: 'Lab manuals are detailed and easy to understand. Very helpful before practicals.', material: 'Thermodynamics Lab Manual' },
  { name: 'Yash Date', branch: 'Electronics Engineering', text: 'Great micro-project ideas. I found a topic and completed my report quickly.', material: 'IoT Project Collection' },
];

const importantLinks = [
  { name: 'MSBTE Official Portal', url: 'https://msbte.ac.in/', description: 'Official MSBTE website' },
  { name: 'Student Login Portal', url: 'https://mahadbt.maharashtra.gov.in/Login/Login', description: 'Access student services and dashboard' },
  { name: 'Academic Calendar', url: 'https://drive.google.com/file/d/1AuwaO-r6HYUSYaMGggBtPtUghV3SO4tz/view?usp=drive_link', description: 'Important academic dates' },
];

function SectionHeading({ title, description, icon: Icon }: { title: string; description: string; icon?: React.ElementType }) {
  return (
    <div className="section-header">
      <div className="section-title-wrapper">
        {Icon && <Icon className="section-icon" size={32} />}
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-subtitle">{description}</p>
    </div>
  );
}

export function Home() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [trendingMaterials, setTrendingMaterials] = useState<TrendingMaterial[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const trending = data.filter((m: any) => m.is_trending && !m.title.startsWith('[PENDING]'));
          setTrendingMaterials(trending);
        }
      })
      .catch(() => {});
  }, []);

  const handleShowMaterials = () => {
    if (selectedBranch && selectedSemester) {
      navigate(`/materials?branch=${selectedBranch}&semester=${selectedSemester}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>College Sahayak - Free MSBTE Diploma Study Material & Resources</title>
        <meta name="description" content="Download free MSBTE polytechnic diploma study materials, lab manuals, assignments, microprojects, and previous year question papers for Maharashtra students." />
        <meta name="keywords" content="MSBTE, polytechnic, diploma notes, lab manuals, microprojects, previous year papers, Maharashtra, computer engineering" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: `
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "College Sahayak",
              "url": "https://internship-2k26.vercel.app/",
              "description": "Educational resources for MSBTE diploma students."
            }
          `
        }} />
      </Helmet>
      <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />
        <div className="container hero-content">
          <div className="hero-text animate-fade-in">
            <h1 className="hero-title">
              Your Diploma Studies, <span className="text-gradient">Simplified</span>
            </h1>
            <p className="hero-subtitle">
              Get access to the latest syllabus, practicals, assignments, and micro-projects for your branch.
              Everything you need for your polytechnic journey, in one place.
            </p>
            <div className="hero-actions">
              <a href="#find-materials" className="btn btn-primary btn-lg">
                Explore Resources Now
                <ChevronRight size={20} />
              </a>
              <Link to="/curriculum" className="btn btn-outline btn-lg">
                View Curriculum
              </Link>
            </div>
          </div>
          <div className="hero-visual desktop-only animate-fade-in">
            <div className="hero-card animate-float">
              <div className="hero-card-header">
                <div className="icon-box-logo">
                  <img src="/logo1.png" alt="College Sahayak Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 className="font-semibold">Study Materials</h3>
                  <p className="text-sm text-secondary">Latest & Updated</p>
                </div>
              </div>
              <div className="hero-card-list">
                <div className="hero-card-item">
                  <span>Computer Engineering</span>
                  <span className="badge badge-blue">350+ Files</span>
                </div>
                <div className="hero-card-item">
                  <span>Mechanical Engineering</span>
                  <span className="badge badge-green">280+ Files</span>
                </div>
                <div className="hero-card-item">
                  <span>Electrical Engineering</span>
                  <span className="badge badge-purple">320+ Files</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Resources Section */}
      <section className="section bg-light">
        <div className="container">
          <SectionHeading title="Quick Access Resources" description="Jump directly to what you need" />
          <div className="grid resource-grid">
            {quickResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link key={resource.name} to={resource.path} className="resource-card group">
                  <div className={`resource-icon ${resource.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-link">
                    Access Now <ChevronRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Trending Materials */}
      {trendingMaterials.length > 0 && (
      <section className="section">
        <div className="container">
          <SectionHeading title="Trending This Week" description="Most popular resources among students right now" icon={Flame} />
          <div className="trending-grid">
            {trendingMaterials.map((item) => (
              <article key={item.id} className="trending-card group">
                <div className="trending-header">
                  <span className="badge badge-orange">TRENDING</span>
                  <span className="rating">
                    <Star size={14} className="star-icon" fill="currentColor" />
                    4.9
                  </span>
                </div>
                <h3 className="trending-title">{item.title}</h3>
                <p className="trending-subject">{item.branch}</p>
                <p className="trending-semester">{item.semester}</p>
                <div className="trending-stats">
                  <span className="downloads">
                    <Download size={14} />
                    {item.category}
                  </span>
                </div>
                <a href={item.drive_link} onClick={(e) => { e.preventDefault(); handleProtectedDownload(item.drive_link); }} className="resource-link link-orange">
                  Download Now <ChevronRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 4. Find Materials */}
      <section id="find-materials" className="section bg-light">
        <div className="container" style={{ maxWidth: '900px' }}>
          <SectionHeading title="Get Started: Find Your Study Material" description="Select your branch and semester to access tailored resources" />
          <div className="find-materials-box">
            <div className="step-section">
              <h3 className="step-title">
                <span className="step-number bg-blue">1</span> Choose Your Branch
              </h3>
              <div className="grid branch-grid">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    className={`branch-btn ${selectedBranch === branch.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedBranch(branch.id);
                      setSelectedSemester(null);
                    }}
                  >
                    <span className="branch-icon-box">{branch.icon}</span>
                    <span className="branch-name">{branch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedBranch && (
              <div className="step-section animate-fade-in">
                <h3 className="step-title">
                  <span className="step-number bg-orange">2</span> Choose Your Semester
                </h3>
                <div className="grid semester-grid">
                  {[1, 2, 3, 4, 5, 6].map((semester) => (
                    <button
                      key={semester}
                      className={`semester-btn ${selectedSemester === semester ? 'selected' : ''}`}
                      onClick={() => setSelectedSemester(semester)}
                    >
                      Semester {semester}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedBranch && selectedSemester && (
              <div className="action-section animate-fade-in">
                <button className="btn btn-primary btn-lg bg-green" onClick={handleShowMaterials}>
                  Show Materials <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Trust Features */}
      <section className="section">
        <div className="container">
          <SectionHeading title="For Students & Teachers" description="Why students trust College Sahayak for educational resources" />
          <div className="grid features-grid">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="feature-card">
                  <div className={`feature-icon-wrapper ${feature.bg} ${feature.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Official Updates */}
      <section className="section bg-light">
        <div className="container">
          <SectionHeading title="Official Updates from MSBTE" description="Stay updated with announcements and important information" icon={Bell} />
          <div className="grid updates-grid">
            {officialUpdates.map((update) => (
              <article key={update.title} className="update-card">
                <div className="update-header">
                  <span className={`badge ${update.priority === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                    {update.type}
                  </span>
                  <span className="update-date">
                    <Calendar size={14} /> {update.date}
                  </span>
                </div>
                <h3 className="update-title">{update.title}</h3>
                <p className="update-desc">{update.description}</p>
                <div className="resource-link">
                  Read More <ExternalLink size={14} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Reviews */}
      <section className="section">
        <div className="container">
          <SectionHeading title="What Our Students Say" description="Feedback from students who use these resources" icon={Star} />
          <div className="grid reviews-grid">
            {reviews.map((review) => (
              <article key={review.name} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="reviewer-name">{review.name}</div>
                      <div className="reviewer-branch">{review.branch}</div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} className="star-icon" fill="currentColor" />)}
                  </div>
                </div>
                <p className="review-text">"{review.text}"</p>
                <p className="review-material">{review.material}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Important Links */}
      <section className="section bg-light">
        <div className="container">
          <SectionHeading title="Important Links" description="Quick access to essential polytechnic resources" icon={BookmarkPlus} />
          <div className="grid links-grid">
            {importantLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="important-link-card group">
                <div className="important-link-header">
                  <h3>{link.name}</h3>
                  <ExternalLink size={16} className="external-icon" />
                </div>
                <p>{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-text">
            <h2>Need a resource added?</h2>
            <p>Share feedback so the library can improve around real student needs.</p>
          </div>
          <Link to="/feedback" className="btn cta-btn" style={{ backgroundColor: 'white', color: 'var(--primary-dark)' }}>
            <MessageSquare size={20} />
            Send Feedback
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
