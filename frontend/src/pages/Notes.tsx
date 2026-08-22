import { BookOpen, Search, Download, Filter, GraduationCap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import './Curriculum.css';
import { handleProtectedDownload } from '../utils/auth';
import { API_URL } from '../utils/api';

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

export function Notes() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
          setMaterials(data.filter((item: Material) => item.category === 'Notes' && !item.title.startsWith('[PENDING]')));
      })
      .catch(err => console.error("Error fetching materials:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
        <title>MSBTE Diploma Notes | K-Scheme Study Material</title>
        <meta name="description" content="Download high-quality handwritten and typed notes for MSBTE K-Scheme diploma students." />
      </Helmet>
    <div className="material-page-wrapper">
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Study Material
            </div>
            <h1 className="hero-title">
              Subject <span className="text-gradient">Notes</span>
            </h1>
            <p className="hero-description">
              Access comprehensive subject notes and study materials for all MSBTE diploma branches.
            </p>
          </div>
        </div>
      </div>

      <div className="container material-main">
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
                  placeholder="Search notes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Branch</label>
              <select className="filter-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="">All Branches</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Semester</label>
              <select className="filter-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                <option value="">All Semesters</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="material-results">
          <div className="results-header">
            <span className="results-count">Showing {filteredMaterials.length} notes</span>
            <div className="sort-control">
              <label>Sort by:</label>
              <select>
                <option>Newest first</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading materials...</div>
          ) : filteredMaterials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No notes found for the selected filters.</div>
          ) : (
            <div className="cards-grid">
              {filteredMaterials.map((note) => (
                <div key={note.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-code"><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} /> Notes</div>
                    <div className="subject-type" style={{ color: 'var(--primary-color)' }}>PDF Document</div>
                  </div>
                  
                  <h3 className="subject-name">{note.title}</h3>
                  {note.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{note.description}</p>}
                  
                  <div className="subject-meta">
                    <span className="meta-item" style={{ flex: '1 1 100%', fontWeight: 600, color: 'var(--primary-color)' }}>
                      <BookOpen size={14} /> {note.subject_code}
                    </span>
                    <span className="meta-item" style={{ flex: '1 1 100%' }}>
                      <GraduationCap size={14} /> {note.branch}
                    </span>
                    <span className="meta-item">
                      <BookOpen size={14} /> {note.semester}
                    </span>
                  </div>
                  
                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span className="credits">Complete PDF</span>
                    <button 
                      className="btn btn-primary btn-sm download-btn"
                      onClick={() => handleProtectedDownload(note.drive_link)}
                    >
                      <Download size={14} /> Download PDF
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

