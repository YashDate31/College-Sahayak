import { useState, useEffect } from 'react';
import { FolderOpen, Search, Upload, Clock, FileText, Download, Trash2, ChevronRight, FileX, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { ReportUploadModal } from '../components/ReportUploadModal';
import { API_URL } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import './Curriculum.css'; // Reusing material layout styles

const FOLDERS = [
  { id: 'all', name: 'All Documents', icon: FolderOpen },
  { id: 'pending', name: 'Pending Review', icon: Clock },
  { id: 'approved', name: 'Approved', icon: CheckCircle },
  { id: 'recent', name: 'Recent Uploads', icon: FileText },
];

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  semester: string;
  subject_code: string;
  drive_link: string;
  created_at: string;
  status: 'pending' | 'approved';
}

export function MyReports() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please log in to view your documents.');
        setLoading(false);
        return;
      }

      // Decode the token to get current user info
      const decoded: any = jwtDecode(token);
      const userEmail = decoded.email;

      // Fetch all materials (public endpoint) and filter by user's submissions
      // User submissions are marked with [PENDING] or [SUBMITTED_BY:email] prefix
      const res = await fetch(`${API_URL}/api/materials`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      // Filter materials: only show materials uploaded by THIS user
      const userDocs: Document[] = [];

      data.forEach((item: any) => {
        const rawTitle = item.title || '';
        const isPending = rawTitle.startsWith('[PENDING]');
        
        // Parse uploader email from [PENDING][by:email] prefix
        const pendingMatch = rawTitle.match(/^\[PENDING\](\[by:(.*?)\])?\s*(.*)$/i);
        
        if (isPending && pendingMatch) {
          const uploaderEmail = pendingMatch[2] ? pendingMatch[2].toLowerCase().trim() : null;
          const cleanTitle = pendingMatch[3] || rawTitle.replace(/^\[PENDING\]\s*/i, '');

          // Strict user isolation: if uploader email is recorded, only match user's email
          // If legacy pending item (without by:email tag), don't show to other users
          if (!uploaderEmail || uploaderEmail === userEmail.toLowerCase().trim()) {
            userDocs.push({
              id: item.id,
              title: cleanTitle,
              description: item.description || '',
              category: item.category,
              branch: item.branch || '',
              semester: item.semester || '',
              subject_code: item.subject_code || '',
              drive_link: item.drive_link,
              created_at: item.created_at,
              status: 'pending',
            });
          }
        }
      });

      setDocuments(userDocs);
    } catch (err: any) {
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDocuments();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject_code.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFolder === 'all') return matchesSearch;
    if (activeFolder === 'pending') return matchesSearch && doc.status === 'pending';
    if (activeFolder === 'approved') return matchesSearch && doc.status === 'approved';
    if (activeFolder === 'recent') {
      const uploadDate = new Date(doc.created_at);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return matchesSearch && uploadDate > threeDaysAgo;
    }
    return matchesSearch;
  });

  return (
    <div className="material-page-wrapper">
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              Personal Workspace
            </div>
            <h1 className="hero-title">
              My <span className="text-gradient">Documents</span>
            </h1>
            <p className="hero-description">
              Track all your submitted academic documents. Approved documents are published to the Materials Hub for everyone to access!
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
                <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Submit New Document
              </button>
              <button className="btn btn-outline" onClick={fetchMyDocuments}>
                <Loader2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ReportUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={() => {
          setIsUploadOpen(false);
          fetchMyDocuments();
        }} 
      />

      <div className="container material-main">
        <aside className="material-sidebar">
          <div className="filter-card" style={{ padding: '1.25rem' }}>
            <div className="filter-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)' }}>My Folders</h3>
            </div>
            
            <div className="filter-group">
              <div className="search-input" style={{ marginBottom: '1.5rem' }}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {FOLDERS.map((folder) => {
                const Icon = folder.icon;
                const isActive = activeFolder === folder.id;
                
                return (
                  <li key={folder.id}>
                    <button 
                      onClick={() => setActiveFolder(folder.id)}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        border: 'none', 
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                        color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} /> 
                        {folder.name}
                      </div>
                      {isActive && <ChevronRight size={16} />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Legend */}
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(37,99,235,0.04)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Status Guide</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                Pending: Awaiting admin review
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                Approved: Live on platform
              </p>
            </div>
          </div>
        </aside>

        <main className="material-results">
          <div className="results-header">
            <span className="results-count">
              {loading ? 'Loading...' : `${filteredDocs.length} document${filteredDocs.length !== 1 ? 's' : ''}`}
            </span>
            <div className="sort-control">
              <label>Sort by:</label>
              <select>
                <option>Last Submitted</option>
                <option>Name A-Z</option>
                <option>Status</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
              <Loader2 size={40} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} className="animate-spin" />
              <p style={{ color: 'var(--text-secondary)' }}>Loading your documents...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)', marginTop: '1rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-color)', marginBottom: '1.5rem' }}>
                <AlertCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{error}</h3>
              <button className="btn btn-primary" onClick={fetchMyDocuments} style={{ marginTop: '1rem' }}>Try Again</button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredDocs.length === 0 && (
            <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)', marginTop: '1rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                <FileX size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No documents found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                {activeFolder === 'approved' 
                  ? "You don't have any approved documents yet. Submit a document for admin review!"
                  : activeFolder === 'pending'
                  ? "No pending documents. Your submissions may have been approved and are now live!"
                  : "Submit your lab manuals, micro-projects, or notes to contribute to the platform!"}
              </p>
              <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
                <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Submit Document
              </button>
            </div>
          )}

          {/* Documents Grid */}
          {!loading && !error && filteredDocs.length > 0 && (
            <div className="cards-grid">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="subject-card">
                  <div className="card-header">
                    <div className="subject-code">
                      <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {doc.category}
                    </div>
                    <div className="subject-type" style={{ 
                      color: doc.status === 'approved' ? 'var(--success-color)' : '#f59e0b',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {doc.status === 'approved' ? (
                        <><CheckCircle size={12} /> Approved</>
                      ) : (
                        <><Clock size={12} /> Pending Review</>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="subject-name">{doc.title}</h3>
                  
                  <div className="subject-meta">
                    {doc.subject_code && (
                      <span className="meta-item">
                        <FileText size={14} /> {doc.subject_code}
                      </span>
                    )}
                    {doc.branch && (
                      <span className="meta-item">
                        <FolderOpen size={14} /> {doc.branch}
                      </span>
                    )}
                    {doc.semester && (
                      <span className="meta-item">
                        <Clock size={14} /> {doc.semester}
                      </span>
                    )}
                  </div>
                  
                  {doc.status === 'approved' && (
                    <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#059669' }}>
                      ✅ Live on platform — visible to all students
                    </div>
                  )}
                  {doc.status === 'pending' && (
                    <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#d97706' }}>
                      ⏳ Awaiting admin approval
                    </div>
                  )}
                  
                  <div className="card-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <a 
                      href={doc.drive_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline btn-sm download-btn" 
                      style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <Download size={14} /> View Document
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
