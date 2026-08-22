
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  BookOpen, LogOut, PlusCircle, Upload, CheckCircle, List,
  FileText, Check, Trash2, Clock, Users, Database, RefreshCw,
  LayoutDashboard, ExternalLink, AlertCircle, GraduationCap,
  BookMarked, Flame, Star, Table2, Eye, EyeOff, Inbox, MailOpen, Mail
} from 'lucide-react';
import { API_URL } from '../utils/api';
import './AdminDashboard.css';

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  semester: string;
  subject_code: string;
  drive_link: string;
  is_trending?: boolean;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  type: string;
  message: string;
  email: string;
  status: 'read' | 'unread';
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'pending' | 'table' | 'trending' | 'feedback'>('overview');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [pendingMaterials, setPendingMaterials] = useState<Material[]>([]);
  const [activeMaterials, setActiveMaterials] = useState<Material[]>([]);
  const [fetchingPending, setFetchingPending] = useState(true);

  // Feedback State
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [fetchingFeedback, setFetchingFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  // Table search/filter
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Lab Manual',
    branch: '',
    semester: '',
    subjectCode: '',
    examSession: 'Summer',
    driveLink: '',
    imageLink: ''
  });
  const getAuthToken = (): string => {
    return localStorage.getItem('auth_token') || '';
  };

  const fetchAllMaterials = async () => {
    setFetchingPending(true);
    try {
      const res = await fetch(`${API_URL}/api/materials`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const pending = data.filter((item: Material) => item.title.startsWith('[PENDING]'));
        const active = data.filter((item: Material) => !item.title.startsWith('[PENDING]'));
        setPendingMaterials(pending);
        setActiveMaterials(active);
        setAllMaterials(data);
      }
    } catch (err) {
      console.error('Failed to fetch materials');
    } finally {
      setFetchingPending(false);
    }
  };

  const fetchFeedback = async () => {
    setFetchingFeedback(true);
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/api/feedback`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeedbackItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch feedback');
    } finally {
      setFetchingFeedback(false);
    }
  };

  useEffect(() => {
    fetchAllMaterials();
    fetchFeedback();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated. Please log in again.');

      let finalSemester = formData.semester;
      if (formData.category === 'Question Paper' || formData.category === 'Model Answer') {
        finalSemester = `${formData.semester} (${formData.examSession})`;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        branch: formData.branch,
        semester: finalSemester,
        subjectCode: formData.subjectCode,
        driveLink: formData.driveLink,
        imageLink: formData.imageLink
      };

      const response = await fetch(`${API_URL}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add material');
      }

      setSuccess(true);
      setFormData({ title: '', description: '', category: 'Lab Manual', branch: '', semester: '', subjectCode: '', examSession: 'Summer', driveLink: '', imageLink: '' });
      fetchAllMaterials();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, currentTitle: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/api/materials/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: currentTitle })
      });
      if (!response.ok) throw new Error('Failed to approve');
      fetchAllMaterials();
    } catch (err) { alert(err); }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject and delete this material?')) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/api/materials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to reject');
      fetchAllMaterials();
    } catch (err) { alert(err); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await fetch(`${API_URL}/api/materials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAllMaterials();
    } catch (err) { alert(err); }
  };

  const handleToggleTrending = async (id: string, current: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/api/materials/${id}/trending`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_trending: !current })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }
      fetchAllMaterials();
    } catch (err) { alert(err); }
  };

  const handleToggleReadFeedback = async (id: string, currentStatus: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      await fetch(`${API_URL}/api/feedback/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      fetchFeedback();
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
    } catch (err) { alert(err); }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm('Delete this feedback? This cannot be undone.')) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      await fetch(`${API_URL}/api/feedback/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchFeedback();
      if (selectedFeedback && selectedFeedback.id === id) setSelectedFeedback(null);
    } catch (err) { alert(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    // Also sign out Firebase if user had Google-login session
    signOut(auth).catch(() => {});
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'pending', label: 'Review Pending', icon: <Clock size={18} />, badge: pendingMaterials.length > 0 ? pendingMaterials.length : undefined },
    { id: 'upload', label: 'Upload Material', icon: <PlusCircle size={18} /> },
    { id: 'table', label: 'All Materials', icon: <Table2 size={18} /> },
    { id: 'trending', label: 'Manage Trending', icon: <Flame size={18} /> },
    { id: 'feedback', label: 'User Feedback', icon: <Inbox size={18} />, badge: feedbackItems.filter(f => f.status === 'unread').length > 0 ? feedbackItems.filter(f => f.status === 'unread').length : undefined },
  ];

  const topbarTitles: Record<string, { title: string; sub: string }> = {
    overview: { title: 'Dashboard Overview', sub: 'Welcome back, Admin' },
    pending: { title: 'Review Submissions', sub: 'Manage student uploads' },
    upload: { title: 'Upload Material', sub: 'Publish content directly' },
    table: { title: 'All Materials', sub: `${activeMaterials.length} active resources` },
    trending: { title: 'Manage Trending', sub: 'Pin materials on the homepage' },
    feedback: { title: 'Feedback Inbox', sub: `Manage user feedback and feature requests` },
  };

  const filteredTableMaterials = activeMaterials.filter(m => {
    const matchSearch = !tableSearch || m.title.toLowerCase().includes(tableSearch.toLowerCase()) || (m.subject_code || '').toLowerCase().includes(tableSearch.toLowerCase());
    const matchCat = !tableCategory || m.category === tableCategory;
    return matchSearch && matchCat;
  });

  const trendingMaterials = activeMaterials.filter(m => m.is_trending);

  return (
    <div className="admin-root">
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="brand-icon">
            <BookOpen size={20} />
          </div>
          <div className="brand-text">
            <h2>College Sahayak</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id as any)}
            >
              {item.icon}
              {item.label}
              {item.badge !== undefined && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: '1.5rem' }}>Resources</div>
          <a href="/" className="admin-nav-item" style={{ textDecoration: 'none' }}>
            <GraduationCap size={18} />
            View Website
          </a>
          <div className="admin-nav-item" style={{ cursor: 'default', opacity: 0.6 }}>
            <BookMarked size={18} />
            Materials Library
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="admin-main-content">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>{topbarTitles[activeTab]?.title}</h1>
            <p>{topbarTitles[activeTab]?.sub}</p>
          </div>
          <div className="admin-topbar-actions">
            {pendingMaterials.length > 0 && (
              <div className="topbar-badge">
                <Clock size={13} />
                {pendingMaterials.length} pending review
              </div>
            )}
            {activeTab === 'feedback' ? (
              <button
                className="admin-nav-item"
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}
                onClick={fetchFeedback}
              >
                <RefreshCw size={14} /> Refresh Inbox
              </button>
            ) : (
              <button
                className="admin-nav-item"
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}
                onClick={fetchAllMaterials}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            )}
          </div>
        </header>

        <div className="admin-content-area">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon-wrap yellow"><Clock size={26} /></div>
                  <div className="stat-info">
                    <p>Pending Approvals</p>
                    <h3>{fetchingPending ? '—' : pendingMaterials.length}</h3>
                    <span className="stat-sub">Awaiting review</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon-wrap blue"><Database size={26} /></div>
                  <div className="stat-info">
                    <p>Active Materials</p>
                    <h3>{fetchingPending ? '—' : activeMaterials.length}</h3>
                    <span className="stat-sub">Live on platform</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon-wrap green"><Users size={26} /></div>
                  <div className="stat-info">
                    <p>Total Students</p>
                    <h3>Live</h3>
                    <span className="stat-sub">Active users</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon-wrap purple"><Flame size={26} /></div>
                  <div className="stat-info">
                    <p>Trending Items</p>
                    <h3>{fetchingPending ? '—' : trendingMaterials.length}</h3>
                    <span className="stat-sub">Pinned on homepage</span>
                  </div>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div className="admin-panel-header-left">
                    <h2>Quick Actions</h2>
                    <p>Jump to the most common tasks</p>
                  </div>
                </div>
                <div className="admin-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { tab: 'pending', icon: <List size={22} />, wrap: 'yellow', label: 'Review Submissions', sub: pendingMaterials.length > 0 ? `${pendingMaterials.length} waiting` : 'All caught up!' },
                    { tab: 'upload', icon: <Upload size={22} />, wrap: 'blue', label: 'Upload Material', sub: 'Publish directly' },
                    { tab: 'table', icon: <Table2 size={22} />, wrap: 'green', label: 'All Materials', sub: `${activeMaterials.length} items` },
                    { tab: 'feedback', icon: <Inbox size={22} />, wrap: 'purple', label: 'User Feedback', sub: `${feedbackItems.filter(f => f.status === 'unread').length} unread` },
                  ].map(({ tab, icon, wrap, label, sub }) => (
                    <button
                      key={tab}
                      className="admin-stat-card"
                      style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '0.75rem', border: '2px dashed #e2e8f0' }}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      <div className={`stat-icon-wrap ${wrap}`}>{icon}</div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>{label}</p>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PENDING ── */}
          {activeTab === 'pending' && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-header-left">
                  <h2>Student Submissions</h2>
                  <p>Review and approve documents submitted by students</p>
                </div>
                <button className="refresh-btn" onClick={fetchAllMaterials}>
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
              <div className="admin-panel-body">
                {fetchingPending ? (
                  <div className="admin-empty-state"><p>Loading submissions...</p></div>
                ) : pendingMaterials.length === 0 ? (
                  <div className="admin-empty-state">
                    <CheckCircle size={56} />
                    <h3>All Caught Up!</h3>
                    <p>There are no pending materials to review right now.</p>
                  </div>
                ) : (
                  <div className="pending-list">
                    {pendingMaterials.map((mat) => (
                      <div key={mat.id} className="pending-item">
                        <div className="pending-item-left">
                          <span className="pending-category-badge"><FileText size={10} />{mat.category}</span>
                          <h3 className="pending-item-title">{mat.title.replace(/^\[PENDING\](\[by:.*?\])?\s*/i, '').trim()}</h3>
                          <div className="pending-item-meta">
                            <span className="meta-chip code">{mat.subject_code || 'No Code'}</span>
                            <span className="meta-chip"><BookOpen size={12} />{mat.branch}</span>
                            <span className="meta-chip"><GraduationCap size={12} />{mat.semester}</span>
                          </div>
                          <a href={mat.drive_link} target="_blank" rel="noopener noreferrer" className="pending-item-link">
                            <ExternalLink size={12} /> View Document
                          </a>
                        </div>
                        <div className="pending-item-actions">
                          <button className="btn-approve" onClick={() => handleApprove(mat.id, mat.title)}>
                            <Check size={14} /> Approve
                          </button>
                          <button className="btn-reject" onClick={() => handleReject(mat.id)}>
                            <Trash2 size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ALL MATERIALS TABLE ── */}
          {activeTab === 'table' && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-header-left">
                  <h2>All Materials</h2>
                  <p>{activeMaterials.length} active resources in the database</p>
                </div>
                <button className="refresh-btn" onClick={fetchAllMaterials}>
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
              <div className="admin-panel-body">
                {/* Table Filters */}
                <div className="table-filters">
                  <div className="table-search-wrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    <input
                      type="text"
                      placeholder="Search by title or subject code..."
                      value={tableSearch}
                      onChange={e => setTableSearch(e.target.value)}
                      className="table-search-input"
                    />
                  </div>
                  <select className="table-filter-select" value={tableCategory} onChange={e => setTableCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {['Lab Manual', 'Micro Project', 'Question Paper', 'Model Answer', 'Manual Answer', 'Assignments', 'Notes', 'MSBTE IMP', 'Lecture Videos', 'Updates'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Table */}
                <div className="materials-table-wrap">
                  <table className="materials-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Branch</th>
                        <th>Semester</th>
                        <th>Code</th>
                        <th>Trending</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTableMaterials.length === 0 ? (
                        <tr><td colSpan={8} className="table-empty">No materials found.</td></tr>
                      ) : filteredTableMaterials.map((mat, i) => (
                        <tr key={mat.id} className={mat.is_trending ? 'row-trending' : ''}>
                          <td className="td-num">{i + 1}</td>
                          <td className="td-title">
                            <span title={mat.title}>{mat.title}</span>
                            {mat.is_trending && <span className="badge-trending"><Flame size={10} /> Trending</span>}
                          </td>
                          <td><span className="cat-pill">{mat.category}</span></td>
                          <td className="td-muted">{mat.branch}</td>
                          <td className="td-muted">{mat.semester}</td>
                          <td><span className="code-pill">{mat.subject_code}</span></td>
                          <td>
                            <button
                              className={`toggle-trending-btn ${mat.is_trending ? 'on' : 'off'}`}
                              onClick={() => handleToggleTrending(mat.id, !!mat.is_trending)}
                              title={mat.is_trending ? 'Remove from trending' : 'Add to trending'}
                            >
                              {mat.is_trending ? <Eye size={13} /> : <EyeOff size={13} />}
                              {mat.is_trending ? 'Pinned' : 'Pin'}
                            </button>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <a href={mat.drive_link} target="_blank" rel="noopener noreferrer" className="table-action-link" title="View">
                                <ExternalLink size={14} />
                              </a>
                              <button className="table-action-del" onClick={() => handleDelete(mat.id, mat.title)} title="Delete">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="table-count">Showing {filteredTableMaterials.length} of {activeMaterials.length} materials</p>
              </div>
            </div>
          )}

          {/* ── TRENDING MANAGER ── */}
          {activeTab === 'trending' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Currently Trending */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div className="admin-panel-header-left">
                    <h2><Flame size={18} style={{ display: 'inline', marginRight: '0.4rem', color: '#d97706' }} />Currently Trending</h2>
                    <p>These {trendingMaterials.length} items appear in the "Trending This Week" section on the homepage</p>
                  </div>
                </div>
                <div className="admin-panel-body">
                  {trendingMaterials.length === 0 ? (
                    <div className="admin-empty-state">
                      <Flame size={48} />
                      <h3>No Trending Items</h3>
                      <p>Use the table below to pin materials to the homepage trending section.</p>
                    </div>
                  ) : (
                    <div className="trending-grid">
                      {trendingMaterials.map(mat => (
                        <div key={mat.id} className="trending-manage-card">
                          <div className="trending-card-top">
                            <span className="cat-pill">{mat.category}</span>
                            <span className="badge-trending"><Flame size={10} /> Live</span>
                          </div>
                          <h4 className="trending-card-title">{mat.title}</h4>
                          <div className="pending-item-meta" style={{ marginBottom: '0.75rem' }}>
                            <span className="meta-chip code">{mat.subject_code}</span>
                            <span className="meta-chip">{mat.branch}</span>
                            <span className="meta-chip">{mat.semester}</span>
                          </div>
                          <button
                            className="btn-reject"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => handleToggleTrending(mat.id, true)}
                          >
                            <EyeOff size={13} /> Remove from Trending
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pick from all materials */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <div className="admin-panel-header-left">
                    <h2>Pin a Material to Trending</h2>
                    <p>Search and select from all active materials</p>
                  </div>
                </div>
                <div className="admin-panel-body">
                  <div className="table-filters">
                    <div className="table-search-wrap">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                      <input
                        type="text"
                        placeholder="Search materials to pin..."
                        value={tableSearch}
                        onChange={e => setTableSearch(e.target.value)}
                        className="table-search-input"
                      />
                    </div>
                  </div>
                  <div className="materials-table-wrap" style={{ maxHeight: '360px' }}>
                    <table className="materials-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Branch</th>
                          <th>Code</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeMaterials
                          .filter(m => !m.is_trending && (!tableSearch || m.title.toLowerCase().includes(tableSearch.toLowerCase()) || (m.subject_code || '').toLowerCase().includes(tableSearch.toLowerCase())))
                          .map(mat => (
                            <tr key={mat.id}>
                              <td className="td-title"><span title={mat.title}>{mat.title}</span></td>
                              <td><span className="cat-pill">{mat.category}</span></td>
                              <td className="td-muted">{mat.branch}</td>
                              <td><span className="code-pill">{mat.subject_code}</span></td>
                              <td>
                                <button
                                  className="toggle-trending-btn off"
                                  onClick={() => handleToggleTrending(mat.id, false)}
                                >
                                  <Star size={13} /> Pin to Trending
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FEEDBACK INBOX ── */}
          {activeTab === 'feedback' && (
            <div className="feedback-inbox-container">
              <div className="feedback-list-pane">
                <div className="feedback-list-header">
                  <h3>Inbox <span className="feedback-count">{feedbackItems.length}</span></h3>
                </div>
                <div className="feedback-list-content">
                  {fetchingFeedback ? (
                    <div className="admin-empty-state"><p>Loading feedback...</p></div>
                  ) : feedbackItems.length === 0 ? (
                    <div className="admin-empty-state">
                      <Inbox size={48} />
                      <h3>Inbox Zero!</h3>
                      <p>You have no feedback right now.</p>
                    </div>
                  ) : (
                    feedbackItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`feedback-list-item ${item.status === 'unread' ? 'unread' : ''} ${selectedFeedback?.id === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFeedback(item)}
                      >
                        <div className="feedback-item-top">
                          <span className="feedback-sender">{item.email}</span>
                          <span className="feedback-date">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="feedback-item-title">
                          {item.type === 'bug' && <span className="feedback-badge bug">Bug</span>}
                          {item.type === 'suggestion' && <span className="feedback-badge suggestion">Suggestion</span>}
                          {item.type === 'content' && <span className="feedback-badge content">Request</span>}
                          {item.type === 'other' && <span className="feedback-badge other">Other</span>}
                        </div>
                        <p className="feedback-item-preview">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="feedback-view-pane">
                {selectedFeedback ? (
                  <div className="feedback-view-content animate-fade-in">
                    <div className="feedback-view-header">
                      <div className="feedback-view-meta">
                        <h2>{selectedFeedback.type.charAt(0).toUpperCase() + selectedFeedback.type.slice(1)} Feedback</h2>
                        <div className="feedback-sender-info">
                          <div className="sender-avatar">
                            <Mail size={16} />
                          </div>
                          <div>
                            <strong>{selectedFeedback.email}</strong>
                            <div className="sender-time">{new Date(selectedFeedback.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                      <div className="feedback-view-actions">
                        <button 
                          className="btn-mark-read" 
                          onClick={() => handleToggleReadFeedback(selectedFeedback.id, selectedFeedback.status)}
                        >
                          {selectedFeedback.status === 'unread' ? <MailOpen size={16} /> : <Mail size={16} />}
                          {selectedFeedback.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                        <button 
                          className="btn-delete-mail"
                          onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="feedback-view-body">
                      <p style={{ whiteSpace: 'pre-wrap' }}>{selectedFeedback.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="feedback-view-empty">
                    <MailOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <h3>Select an item to read</h3>
                    <p>Click on any feedback from the list to view its contents.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── UPLOAD ── */}
          {activeTab === 'upload' && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div className="admin-panel-header-left">
                  <h2>Upload Material Directly</h2>
                  <p>Items uploaded here bypass the review process and go live instantly.</p>
                </div>
              </div>
              <div className="admin-panel-body">
                <form onSubmit={handleSubmit} className="admin-form">
                  {error && <div className="alert-error"><AlertCircle size={16} />{error}</div>}
                  {success && <div className="alert-success"><CheckCircle size={16} /> Material published successfully!</div>}

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Data Structures Notes" />
                    </div>
                    <div className="form-group">
                      <label>Subject Code *</label>
                      <input type="text" name="subjectCode" value={formData.subjectCode} onChange={handleChange} required placeholder="e.g. 22412" />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="Lab Manual">Lab Manual</option>
                        <option value="Micro Project">Micro Project</option>
                        <option value="Question Paper">Question Paper</option>
                        <option value="Model Answer">Model Answer</option>
                        <option value="Manual Answer">Manual Answer</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Notes">Notes</option>
                        <option value="MSBTE IMP">MSBTE IMP</option>
                        <option value="Lecture Videos">Lecture Videos</option>
                        <option value="Updates">Updates</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Branch *</label>
                      <select name="branch" value={formData.branch} onChange={handleChange} required>
                        <option value="" disabled>Select Branch</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Semester *</label>
                      <select name="semester" value={formData.semester} onChange={handleChange} required>
                        <option value="" disabled>Select Semester</option>
                        {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {(formData.category === 'Question Paper' || formData.category === 'Model Answer') && (
                      <div className="form-group">
                        <label>Exam Session *</label>
                        <select name="examSession" value={formData.examSession} onChange={handleChange}>
                          <option value="Summer">Summer</option>
                          <option value="Winter">Winter</option>
                        </select>
                      </div>
                    )}
                    <div className="form-group full-width">
                      <label>Google Drive Link *</label>
                      <input type="url" name="driveLink" value={formData.driveLink} onChange={handleChange} required placeholder="https://drive.google.com/..." />
                    </div>
                    <div className="form-group full-width">
                      <label>Thumbnail Image Link (Optional)</label>
                      <input type="url" name="imageLink" value={formData.imageLink} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="form-group full-width">
                      <label>Description (Optional)</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Add a brief description..." />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-publish" disabled={loading}>
                      {loading ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : <><Upload size={16} /> Publish Material</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
