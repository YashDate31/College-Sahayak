import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Curriculum.css';

const mockSemesters = [
  {
    semester: 'Semester 1',
    subjects: [
      { id: '1', title: 'English', code: '22101', type: 'Theory + Practical' },
      { id: '2', title: 'Basic Science', code: '22102', type: 'Theory + Practical' },
      { id: '3', title: 'Basic Mathematics', code: '22103', type: 'Theory' },
    ]
  },
  {
    semester: 'Semester 2',
    subjects: [
      { id: '4', title: 'Communication Skills', code: '22201', type: 'Theory + Practical' },
      { id: '5', title: 'Applied Science', code: '22202', type: 'Theory + Practical' },
      { id: '6', title: 'Applied Mathematics', code: '22206', type: 'Theory' },
    ]
  }
];

export function Branch() {
  const { branchId } = useParams();
  const branchName = branchId?.toUpperCase() === 'CO' ? 'Computer Engineering' : 
                     branchId?.toUpperCase() === 'IF' ? 'Information Technology' : 'Engineering Branch';

  return (
    <div className="material-page-wrapper">
      <div className="material-hero">
        <div className="container">
          <div className="material-hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              {branchName} ({branchId?.toUpperCase()})
            </div>
            <h1 className="hero-title">
              Branch <span className="text-gradient">Curriculum</span>
            </h1>
            <p className="hero-description">
              Select your semester to view detailed subject syllabus, teaching schemes, and download study materials.
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {mockSemesters.map((sem, i) => (
            <div key={i}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '1rem' }}>
                  {i + 1}
                </span>
                {sem.semester}
              </h2>
              
              <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {sem.subjects.map(sub => (
                  <Link to={`/curriculum/${sub.id}`} key={sub.id} className="subject-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div className="card-header">
                      <div className="subject-code">{sub.code}</div>
                      <div className="subject-type" style={{ color: 'var(--primary-color)' }}>{sub.type}</div>
                    </div>
                    
                    <h3 className="subject-name" style={{ marginBottom: '1rem' }}>{sub.title}</h3>
                    
                    <div className="card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600 }}>
                        View Details <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
