import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import StatusBadge from '../../components/common/StatusBadge';

const MyApplications = () => {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/me')
      .then(r => setApps(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Applications</h1>
      <p style={s.sub}>{apps.length} application{apps.length !== 1 ? 's' : ''} total</p>

      {loading ? <p style={s.msg}>Loading...</p> :
       apps.length === 0 ? (
        <div style={s.empty}>
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/jobs" style={s.btn}>Browse Jobs</Link>
        </div>
       ) : (
        <div style={s.list}>
          {apps.map(app => (
            <Link to={`/my-applications/${app._id}`} key={app._id} style={s.card}>
              <div style={s.left}>
                <div style={s.jobTitle}>{app.job?.title}</div>
                <div style={s.jobBranch}>{app.job?.branch?.name || 'Remote'}</div>
                <div style={s.date}>Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={s.right}>
                <StatusBadge status={app.status} />
                <span style={s.arrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
       )}
    </div>
  );
};

const s = {
  page:     { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  title:    { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:      { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  list:     { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  card:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.2rem 1.5rem', color: 'inherit', transition: 'border-color 0.2s' },
  left:     { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  jobTitle: { fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' },
  jobBranch:{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600 },
  date:     { color: '#64748b', fontSize: '0.78rem' },
  right:    { display: 'flex', alignItems: 'center', gap: '1rem' },
  arrow:    { color: '#64748b' },
  empty:    { textAlign: 'center', padding: '4rem 0', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  btn:      { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' },
  msg:      { color: '#64748b' },
};

export default MyApplications;