import { Search, Filter, GraduationCap, Download, Calendar, FileText, BookOpen } from 'lucide-react';
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

export function QuestionPapers() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSession, setSelectedSession] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data.filter((item: Material) => (item.category === 'Question Paper' || item.category === 'Model Answer') && !item.title.startsWith('[PENDING]')));
        }
      })
      .catch(err => console.error("Error fetching materials:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesBranch = !selectedBranch || material.branch.toLowerCase().includes(selectedBranch.toLowerCase());
    
    // Semester could be "Semester 4 (Summer)", so we use includes
    const matchesSemester = !selectedSemester || material.semester.toLowerCase().includes(selectedSemester.toLowerCase());

    const matchesType = !selectedType || material.category === selectedType;

    const matchesSession = !selectedSession || material.semester.toLowerCase().includes(selectedSession.toLowerCase());
    
    return matchesSearch && matchesBranch && matchesSemester && matchesType && matchesSession;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedSemester('');
    setSelectedType('');
    setSelectedSession('');
  };

  return (
    <>
      <Helmet>
        <title>MSBTE Previous Year Question Papers (PYQ) | K-Scheme</title>
        <meta name="description" content="Download MSBTE previous year question papers (PYQs) and model answers for all diploma engineering branches." />
      </Helmet>
    <div className="material-page-wrapper">
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Exam Preparation
            </div>
            <h1 className="hero-title">
              Question <span className="text-gradient">Papers</span>
            </h1>
            <p className="hero-description">
              Access previous years' MSBTE question papers and model answers to ace your upcoming semester exams.
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
                  placeholder="Subject name or code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Paper Type</label>
              <select className="filter-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">All Types</option>
                <option value="Question Paper">Question Papers</option>
                <option value="Model Answer">Model Answers</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Exam Session</label>
              <select className="filter-select" value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                <option value="">All Sessions</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
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
            <span className="results-count">Showing {filteredMaterials.length} papers</span>
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
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No question papers found for the selected filters.</div>
          ) : (
            <div className="cards-grid">
              {filteredMaterials.map((paper) => (
                <div key={paper.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-code"><FileText size={14} style={{ display: 'inline', marginRight: '4px' }} /> Paper</div>
                    <div className="subject-type" style={{ color: paper.category === 'Model Answer' ? 'var(--success-color)' : 'var(--primary-color)' }}>
                      {paper.category}
                    </div>
                  </div>
                  
                  <h3 className="subject-name">{paper.title}</h3>
                  {paper.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{paper.description}</p>}
                  
                  <div className="subject-meta">
                    <span className="meta-item" style={{ flex: '1 1 100%', fontWeight: 600, color: 'var(--primary-color)' }}>
                      <BookOpen size={14} /> {paper.subject_code}
                    </span>
                    <span className="meta-item" style={{ flex: '1 1 100%' }}>
                      <GraduationCap size={14} /> {paper.branch}
                    </span>
                    <span className="meta-item">
                      <Calendar size={14} /> {paper.semester}
                    </span>
                  </div>
                  
                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span className="credits">Complete PDF</span>
                    <button 
                      className="btn btn-primary btn-sm download-btn"
                      onClick={() => handleProtectedDownload(paper.drive_link)}
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

