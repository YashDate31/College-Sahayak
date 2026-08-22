import { Rocket, Search, Filter, GraduationCap, Download, FileText, BookOpen } from 'lucide-react';
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

export function MicroProjects() {
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
          setMaterials(data.filter((item: Material) => item.category === 'Micro Project' && !item.title.startsWith('[PENDING]')));
        }
      })
      .catch(err => console.error("Error fetching materials:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // We map branch UI values to actual dropdown values sent from Admin panel
    const matchesBranch = !selectedBranch || material.branch.toLowerCase().includes(selectedBranch.toLowerCase());
    
    // We map semester UI values to actual values
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
        <title>MSBTE Micro Projects | Ideas & Reports | K-Scheme</title>
        <meta name="description" content="Get the best MSBTE K-Scheme micro project ideas, reports, and source code for Computer, IT, and other diploma branches." />
      </Helmet>
    <div className="material-page-wrapper">
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Project Portfolio
            </div>
            <h1 className="hero-title">
              Micro <span className="text-gradient">Projects</span>
            </h1>
            <p className="hero-description">
              Discover high-quality MSBTE micro-projects with full reports and source code. Perfect reference material for your academic projects.
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
                  placeholder="Search projects..." 
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
            <span className="results-count">Showing {filteredMaterials.length} projects</span>
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
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No projects found for the selected filters.</div>
          ) : (
            <div className="cards-grid">
              {filteredMaterials.map((project) => (
                <div key={project.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-code"><Rocket size={14} style={{ display: 'inline', marginRight: '4px' }} /> Project</div>
                    <div className="subject-type" style={{ color: 'var(--success-color)' }}>Source Code</div>
                  </div>
                  
                  <h3 className="subject-name">{project.title}</h3>
                  {project.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description}</p>}
                  
                  <div className="subject-meta">
                    <span className="meta-item" style={{ flex: '1 1 100%', fontWeight: 600, color: 'var(--primary-color)' }}>
                      <BookOpen size={14} /> {project.subject_code}
                    </span>
                    <span className="meta-item" style={{ flex: '1 1 100%' }}>
                      <GraduationCap size={14} /> {project.branch}
                    </span>
                    <span className="meta-item">
                      <FileText size={14} /> {project.semester}
                    </span>
                  </div>
                  
                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span className="credits">Complete Files</span>
                    <button 
                      className="btn btn-primary btn-sm download-btn"
                      onClick={() => handleProtectedDownload(project.drive_link)}
                    >
                      <Download size={14} /> Download Files
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

