import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data.data.slice(0, 6)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.tag}>Multi-Branch Recruitment System</div>
          <h1 style={s.heroTitle}>Find Your Next<br />Big Opportunity</h1>
          <p style={s.heroSub}>Browse open positions across all our branches and apply in minutes.</p>
          <div style={s.heroBtns}>
            <Link to="/jobs" style={s.btnPrimary}>Browse All Jobs</Link>
            <Link to="/register" style={s.btnOutline}>Create Account</Link>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div style={s.section}>
        <h2 style={s.secTitle}>Latest Openings</h2>
        <p style={s.secSub}>Fresh opportunities added recently</p>
        <div style={s.grid}>
          {jobs.length === 0 && <p style={{ color: '#64748b' }}>No jobs available yet.</p>}
          {jobs.map(job => (
            <div key={job._id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.branch}>{job.branch?.name || 'Remote'}</span>
                <span style={s.seats}>{job.availableSeats} seats</span>
              </div>
              <h3 style={s.cardTitle}>{job.title}</h3>
              <p style={s.cardDesc}>{job.description?.slice(0, 100)}...</p>
              <Link to={`/jobs/${job._id}`} style={s.cardLink}>View Details →</Link>
            </div>
          ))}
        </div>
        {jobs.length > 0 &&
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/jobs" style={s.btnPrimary}>View All Jobs</Link>
          </div>
        }
      </div>
    </div>
  );
};

const s = {
  hero: {
    background: 'radial-gradient(ellipse at 50% 0%, #0f2044 0%, #0a0f1e 65%)',
    padding: '6rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid #1e2d45',
  },
  heroInner: { maxWidth: '640px', margin: '0 auto' },
  tag: {
    display: 'inline-block',
    background: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '0.3rem 0.9rem',
    borderRadius: '20px',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800,
    color: '#f1f5f9',
    lineHeight: 1.15,
    marginBottom: '1rem',
  },
  heroSub: { color: '#64748b', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 },
  heroBtns: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff',
    padding: '0.75rem 1.8rem',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  btnOutline: {
    border: '1px solid #1e2d45',
    color: '#94a3b8',
    padding: '0.75rem 1.8rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  section: { maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' },
  secTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '0.4rem',
  },
  secSub: { color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    transition: 'border-color 0.2s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  branch: {
    background: 'rgba(6,182,212,0.1)',
    color: '#06b6d4',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  seats: { color: '#64748b', fontSize: '0.8rem' },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    color: '#f1f5f9',
  },
  cardDesc: { color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, flexGrow: 1 },
  cardLink: { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.4rem' },
};

export default Home;