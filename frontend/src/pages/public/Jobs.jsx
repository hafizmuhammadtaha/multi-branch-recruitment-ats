import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const Jobs = () => {
  const [jobs, setJobs]       = useState([]);
  const [branches, setBranches] = useState([]);
  const [title, setTitle]     = useState('');
  const [branch, setBranch]   = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const departments = ['Engineering', 'Design', 'Marketing', 'HR', 'QA', 'DevOps', 'Management', 'Finance', 'Sales', 'Support'];

  useEffect(() => {
    api.get('/branches').then(r => setBranches(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (title)  params.title  = title;
    if (branch) params.branch = branch;
    if (department) params.department = department;
    api.get('/jobs', { params })
      .then(r => setJobs(r.data.data))
      .finally(() => setLoading(false));
  }, [title, branch, department]);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>All Job Openings</h1>
        <p style={s.sub}>{jobs.length} position{jobs.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <input
          placeholder="Search by title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={s.input}
        />
        <select value={branch} onChange={e => setBranch(e.target.value)} style={s.select}>
          <option value="">All Branches</option>
          {branches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
        </select>
        <select value={department} onChange={e => setDepartment(e.target.value)} style={s.select}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <p style={s.msg}>Loading...</p>
      ) : jobs.length === 0 ? (
        <p style={s.msg}>No jobs found.</p>
      ) : (
        <div style={s.grid}>
          {jobs.map(job => (
            <div key={job._id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.branch}>{job.branch?.name || 'Remote'}</span>
                <span style={s.seats}>{job.availableSeats} seats left</span>
              </div>
              <h3 style={s.cardTitle}>{job.title}</h3>
              <p style={s.cardDesc}>{job.description?.slice(0, 120)}...</p>
              <Link to={`/jobs/${job._id}`} style={s.btn}>View & Apply →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { marginBottom: '2rem' },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '2rem',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '0.3rem',
  },
  sub: { color: '#64748b', fontSize: '0.9rem' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  input: {
    flex: 1,
    minWidth: '200px',
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    padding: '0.65rem 1rem',
    color: '#f1f5f9',
    fontSize: '0.9rem',
    outline: 'none',
  },
  select: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    padding: '0.65rem 1rem',
    color: '#f1f5f9',
    fontSize: '0.9rem',
    outline: 'none',
    minWidth: '160px',
  },
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
  btn: {
    marginTop: '0.4rem',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff',
    padding: '0.6rem 1rem',
    borderRadius: '7px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  msg: { color: '#64748b', textAlign: 'center', marginTop: '3rem' },
};

export default Jobs;