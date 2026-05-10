import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import StatusBadge from '../../components/common/StatusBadge';

const statuses = ['', 'Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];

const Applications = () => {
  const [apps, setApps]         = useState([]);
  const [jobs, setJobs]         = useState([]);
  const [status, setStatus]     = useState('');
  const [jobId, setJobId]       = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (jobId)  params.jobId  = jobId;
    api.get('/applications', { params })
      .then(r => setApps(r.data.data))
      .finally(() => setLoading(false));
  }, [status, jobId]);

  return (
    <div style={s.page}>
      <h1 style={s.title}>All Applications</h1>
      <p style={s.sub}>{apps.length} application{apps.length !== 1 ? 's' : ''}</p>

      <div style={s.filters}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={s.select}>
          {statuses.map(st => <option key={st} value={st}>{st || 'All Statuses'}</option>)}
        </select>
        <select value={jobId} onChange={e => setJobId(e.target.value)} style={s.select}>
          <option value="">All Jobs</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {loading ? <p style={s.msg}>Loading...</p> :
       apps.length === 0 ? <p style={s.msg}>No applications found.</p> :
      <div style={s.list}>
        {apps.map(app => (
          <Link to={`/hr/applications/${app._id}`} key={app._id} style={s.card}>
            <div style={s.left}>
              <div style={s.name}>{app.candidate?.name}</div>
              <div style={s.email}>{app.candidate?.email}</div>
            </div>
            <div style={s.mid}>
              <div style={s.jobTitle}>{app.job?.title}</div>
              <div style={s.date}>{new Date(app.createdAt).toLocaleDateString()}</div>
            </div>
            <StatusBadge status={app.status} />
          </Link>
        ))}
      </div>}
    </div>
  );
};

const s = {
  page:     { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  title:    { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:      { color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' },
  filters:  { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  select:   { background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.65rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none', minWidth: '180px' },
  list:     { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  card:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.1rem 1.5rem', color: 'inherit' },
  left:     { flex: 1 },
  name:     { fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '0.2rem' },
  email:    { color: '#64748b', fontSize: '0.78rem' },
  mid:      { flex: 1 },
  jobTitle: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' },
  date:     { color: '#64748b', fontSize: '0.75rem' },
  msg:      { color: '#64748b', fontSize: '0.9rem' },
};

export default Applications;