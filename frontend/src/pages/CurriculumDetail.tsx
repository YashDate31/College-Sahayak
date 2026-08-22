import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText, CheckCircle } from 'lucide-react';
import './Curriculum.css'; // Reusing material styles

export function CurriculumDetail() {
  useParams(); // id unused

  // Mock data for the subject detail
  const subject = {
    title: 'Data Structures using C',
    code: '22317',
    type: 'Theory + Practical',
    credits: 6,
    teachingScheme: {
      theory: 3,
      practical: 2,
      tutorial: 0
    },
    units: [
      { id: 1, title: 'Introduction to Data Structures', hours: 6, marks: 12 },
      { id: 2, title: 'Searching and Sorting', hours: 8, marks: 14 },
      { id: 3, title: 'Stacks and Queues', hours: 10, marks: 16 },
      { id: 4, title: 'Linked Lists', hours: 12, marks: 16 },
      { id: 5, title: 'Trees and Graphs', hours: 12, marks: 12 }
    ]
  };

  return (
    <div className="material-page-wrapper">
      <div className="material-hero" style={{ padding: '3rem 0', minHeight: 'auto' }}>
        <div className="container">
          <Link to="/curriculum" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, marginBottom: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to Curriculum
          </Link>
          <div className="material-hero-content" style={{ textAlign: 'left', maxWidth: '800px', margin: '0' }}>
            <div className="badge">
              <span className="badge-dot"></span>
              {subject.code}
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {subject.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 500 }}>
                <BookOpen size={16} /> {subject.type}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 500 }}>
                <CheckCircle size={16} /> {subject.credits} Credits
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Teaching Scheme */}
        <section style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Teaching Scheme (Hours/Week)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Theory</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{subject.teachingScheme.theory}</div>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Practical</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{subject.teachingScheme.practical}</div>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tutorial</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{subject.teachingScheme.tutorial}</div>
            </div>
          </div>
        </section>

        {/* Syllabus Units */}
        <section style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Syllabus Units</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {subject.units.map((unit, index) => (
              <div key={unit.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--background-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--border-color)', display: 'flex', alignItems: 'center' }}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{unit.title}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {unit.hours} Hours</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={14} /> {unit.marks} Marks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
