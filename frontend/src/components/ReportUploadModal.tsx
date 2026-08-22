import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../utils/api';

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReportUploadModal({ isOpen, onClose, onSuccess }: ReportUploadModalProps) {
  const [reportType, setReportType] = useState('Lab Manual');
  const [title, setTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setReportType('Lab Manual');
    setTitle('');
    setBranch('');
    setSemester('');
    setSubjectCode('');
    setDriveLink('');
    setDescription('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !branch || !driveLink || !semester || !subjectCode) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('You must be logged in to upload material.');

      const payload = {
        title,
        description,
        category: reportType,
        branch,
        semester,
        subjectCode,
        driveLink,
        imageLink: ''
      };

      const response = await fetch(`${API_URL}/api/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload material');
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' };
  const inputStyle = { width: '100%', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', fontSize: '0.875rem' };

  return (
    <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Submit Material for Review</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--success-color)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Upload Successful</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Your document is now queued for admin approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
            {error && (
              <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', borderRadius: 'var(--radius-md)', background: 'var(--danger-light)', padding: '1rem', color: '#b91c1c', fontSize: '0.875rem' }}>
                <AlertCircle size={18} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                <p>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Document Type *</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={inputStyle} required>
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Micro Project">Micro Project</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="Model Answer">Model Answer</option>
                  <option value="Notes">Notes</option>
                  <option value="Manual Answer">Manual Answer</option>
                  <option value="MSBTE IMP">MSBTE IMP</option>
                  <option value="Lecture Videos">Lecture Videos</option>
                  <option value="Updates">Updates</option>
                  <option value="Assignments">Assignments</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Computer Networks Notes" style={inputStyle} required maxLength={250} />
              </div>

              <div>
                <label style={labelStyle}>Subject Code *</label>
                <input type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} placeholder="E.g., 22412" style={inputStyle} required maxLength={20} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Branch *</label>
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} style={inputStyle} required>
                    <option value="">Select Branch</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Semester *</label>
                  <select value={semester} onChange={(e) => setSemester(e.target.value)} style={inputStyle} required>
                    <option value="">Select Sem</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Google Drive Link *</label>
                <input type="url" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="https://drive.google.com/..." style={inputStyle} required />
              </div>

              <div>
                <label style={labelStyle}>Description (Optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a short description..." style={{...inputStyle, resize: 'vertical', minHeight: '80px'}} />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !driveLink || !title || !branch || !semester || !subjectCode}>
                {isSubmitting ? (
                  <><Loader2 size={16} className="spinner" style={{ marginRight: '0.5rem' }} /> Submitting...</>
                ) : (
                  <><Upload size={16} style={{ marginRight: '0.5rem' }} /> Submit for Approval</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
