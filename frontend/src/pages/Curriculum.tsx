import { GraduationCap, Search, Filter, BookOpen, Download, FileX } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { handleProtectedDownload } from '../utils/auth';
import { API_URL } from '../utils/api';
import './Curriculum.css';

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  semester: string;
  subject_code: string;
  drive_link: string;
  image_link: string;
  created_at: string;
}

export function Curriculum() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data.filter((item: Material) => item.category === 'Curriculum' && !item.title.startsWith('[PENDING]')));
        }
      })
      .catch(err => console.error("Error fetching curriculum materials:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (material.subject_code && material.subject_code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBranch = !selectedBranch || material.branch.toLowerCase().includes(selectedBranch.toLowerCase());
    
    const matchesSemester = !selectedSemester || material.semester.toLowerCase().includes(selectedSemester.toLowerCase());
    
    return matchesSearch && matchesBranch && matchesSemester;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedSemester('');
  };

  return (
    <>
      <Helmet>
        <title>MSBTE K-Scheme Curriculum & Syllabus | College Sahayak</title>
        <meta name="description" content="Download official MSBTE K-Scheme curriculum, syllabus, and course outcomes for all diploma branches and semesters." />
      </Helmet>
    <div className="material-page-wrapper">
      
      {/* Hero Section */}
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Official MSBTE K-Scheme Curriculum
            </div>
            <h1 className="hero-title">
              MSBTE <span className="text-gradient">Curriculum</span>
            </h1>
            <p className="hero-description">
              Browse the official MSBTE curriculum for all diploma programmes. Search by subject code, name, branch, or semester. View course outcomes, units, practicals, and download the official syllabus.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container material-main">
        
        {/* Filters Sidebar */}
        <aside className="material-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <h3><Filter size={18} /> Filters</h3>
              <button className="clear-btn" onClick={clearFilters}>Clear all</button>
            </div>
            
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Subject code or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Programme / Branch</label>
              <select 
                className="filter-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">All Programmes</option>
                <option value="Computer">Computer Engineering (CO)</option>
                <option value="Information">Information Technology (IF)</option>
                <option value="Civil">Civil Engineering (CE)</option>
                <option value="Mechanical">Mechanical Engineering (ME)</option>
                <option value="Electrical">Electrical Engineering (EE)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Semester</label>
              <select 
                className="filter-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="material-results">
          <div className="results-header">
            <span className="results-count">Showing {filteredMaterials.length} curriculum subjects</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              Loading MSBTE Curriculum...
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="empty-state" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '4rem 2rem',
              background: 'var(--surface-color)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-color)',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(37,99,235,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--primary-color)',
                marginBottom: '1.5rem'
              }}>
                <FileX size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No curriculum subjects found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                We couldn't find any curriculum subjects matching your filters. Please try clearing your search criteria.
              </p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredMaterials.map((subject) => (
                <div key={subject.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-code">{subject.subject_code || 'MSBTE'}</div>
                    <div className="subject-type">{subject.category}</div>
                  </div>
                  
                  <h3 className="subject-name">{subject.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {subject.description}
                  </p>
                  
                  <div className="subject-meta">
                    <span className="meta-item">
                      <GraduationCap size={14} /> {subject.branch}
                    </span>
                    <span className="meta-item">
                      <BookOpen size={14} /> {subject.semester}
                    </span>
                  </div>
                  
                  <div className="card-footer" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                      onClick={() => handleProtectedDownload(subject.drive_link)} 
                      className="btn btn-primary btn-sm download-btn"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Download size={14} /> Download Curriculum PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
    </>
  );
}
