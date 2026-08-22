import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, Search, Download, Filter, GraduationCap, 
  Settings, FolderOpen, FileText, MonitorPlay, CheckCircle, Lightbulb
} from 'lucide-react';
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

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Lab Manual': <Settings size={18} />,
  'Micro Project': <Lightbulb size={18} />,
  'Question Paper': <FileText size={18} />,
  'Model Answer': <CheckCircle size={18} />,
  'Manual Answer': <BookOpen size={18} />,
  'Assignments': <FileText size={18} />,
  'Notes': <BookOpen size={18} />,
  'MSBTE IMP': <GraduationCap size={18} />,
  'Lecture Videos': <MonitorPlay size={18} />,
  'Updates': <FolderOpen size={18} />,
};

export function MaterialsHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  
  // URL Params State
  const initialBranch = searchParams.get('branch') || '';
  const initialSemester = searchParams.get('semester') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);

  // Sync state back to URL if they change filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBranch) params.set('branch', selectedBranch);
    if (selectedSemester) params.set('semester', selectedSemester);
    setSearchParams(params, { replace: true });
  }, [selectedBranch, selectedSemester, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/materials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data.filter((item: Material) => !item.title.startsWith('[PENDING]')));
        }
      })
      .catch(err => console.error("Error fetching materials:", err))
      .finally(() => setLoading(false));
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedSemester('');
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (material.description && material.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // We map the branch short codes if needed, but assuming DB stores full names or we match substrings
      // Ex: "CO" from homepage might need to map to "Computer Engineering". 
      // Let's do a substring match just in case.
      const branchLower = selectedBranch.toLowerCase();
      const materialBranchLower = material.branch.toLowerCase();
      
      let matchesBranch = true;
      if (selectedBranch) {
        if (branchLower === 'co' && materialBranchLower.includes('computer')) matchesBranch = true;
        else if (branchLower === 'me' && materialBranchLower.includes('mechanical')) matchesBranch = true;
        else if (branchLower === 'ee' && materialBranchLower.includes('electrical')) matchesBranch = true;
        else if (branchLower === 'cv' && materialBranchLower.includes('civil')) matchesBranch = true;
        else if (branchLower === 'ex' && materialBranchLower.includes('electronics')) matchesBranch = true;
        else if (branchLower === 'au' && materialBranchLower.includes('automobile')) matchesBranch = true;
        else matchesBranch = materialBranchLower.includes(branchLower);
      }

      let matchesSemester = true;
      if (selectedSemester) {
        const semLower = selectedSemester.toLowerCase();
        const matSemLower = material.semester.toLowerCase();
        
        // If url is "3", match "Semester 3". If url is "Semester 3", match it.
        if (semLower.length === 1) {
          matchesSemester = matSemLower.includes(`semester ${semLower}`) || matSemLower.includes(`sem ${semLower}`);
        } else {
          matchesSemester = matSemLower.includes(semLower);
        }
      }

      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [materials, searchQuery, selectedBranch, selectedSemester]);

  // Map short codes back to nice readable names for the select boxes
  const mapBranchCodeToName = (code: string) => {
    switch (code) {
      case 'CO': return 'Computer Engineering';
      case 'ME': return 'Mechanical Engineering';
      case 'EE': return 'Electrical Engineering';
      case 'CV': return 'Civil Engineering';
      case 'EX': return 'Electronics Engineering';
      case 'AU': return 'Automobile Engineering';
      default: return code;
    }
  };

  const getSemesterName = (val: string) => {
    if (val.length === 1) return `Semester ${val}`;
    return val;
  };

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedSemester]);

  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMaterials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMaterials, currentPage]);

  // Group materials by category for the CURRENT PAGE
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, Material[]> = {};
    paginatedMaterials.forEach(mat => {
      const cat = mat.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(mat);
    });
    return groups;
  }, [paginatedMaterials]);

  const displayBranch = selectedBranch ? mapBranchCodeToName(selectedBranch) : 'All Branches';
  const displaySemester = selectedSemester ? getSemesterName(selectedSemester) : 'All Semesters';

  return (
    <div className="material-page-wrapper">
      <Helmet>
        <title>{`Study Materials - ${displayBranch} | College Sahayak`}</title>
        <meta name="description" content={`Download study materials, lab manuals, and notes for ${displayBranch} - ${displaySemester}.`} />
      </Helmet>
      
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Unified Resource Hub
            </div>
            <h1 className="hero-title">
              Your <span className="text-gradient">Study Materials</span>
            </h1>
            <p className="hero-description">
              Everything you need for <strong>{displayBranch}</strong> {selectedSemester ? `â€” ${displaySemester}` : ''}. 
              Browse lab manuals, micro projects, previous year papers, and notes below.
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
              <label>Search Files</label>
              <div className="search-input">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search materials..." 
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
                <option value="CO">CO (Comp Engg)</option>
                <option value="ME">ME (Mech Engg)</option>
                <option value="EE">EE (Electrical Engg)</option>
                <option value="CV">CV (Civil Engg)</option>
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
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="material-results">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading materials...</div>
          ) : filteredMaterials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No materials found for the selected branch and semester. <br />
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={clearFilters}>View All Materials</button>
            </div>
          ) : (
            Object.keys(groupedMaterials).sort().map(category => (
              <div key={category} style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--primary-color)' }}>
                    {CATEGORY_ICONS[category] || <FolderOpen size={24} />}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{category}</h2>
                  <span style={{ marginLeft: 'auto', background: 'var(--bg-color)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {groupedMaterials[category].length} items
                  </span>
                </div>

                <div className="cards-grid">
                  {groupedMaterials[category].map((manual) => (
                    <div key={manual.id} className="subject-card">
                      <div className="card-header">
                        <div className="subject-code"><Settings size={14} style={{ display: 'inline', marginRight: '4px' }} /> {manual.subject_code}</div>
                        <div className="subject-type">PDF Document</div>
                      </div>
                      
                      <h3 className="subject-name">{manual.title}</h3>
                      {manual.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: '1 1 auto' }}>{manual.description}</p>}
                      
                      <div className="subject-meta" style={{ marginTop: manual.description ? 'auto' : '1rem' }}>
                        <span className="meta-item" style={{ flex: '1 1 100%' }}>
                          <GraduationCap size={14} /> {manual.branch}
                        </span>
                        <span className="meta-item">
                          <BookOpen size={14} /> {manual.semester}
                        </span>
                      </div>
                      
                      <div className="card-footer" style={{ marginTop: 'auto' }}>
                        <span className="credits">Complete PDF</span>
                        <button 
                          className="btn btn-primary btn-sm download-btn"
                          onClick={() => handleProtectedDownload(manual.drive_link)}
                        >
                          <Download size={14} /> View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', padding: '1rem' }}>
              <button 
                className="btn btn-outline" 
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                Page {currentPage} of {totalPages}
              </div>
              <button 
                className="btn btn-outline" 
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

