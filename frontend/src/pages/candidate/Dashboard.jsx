import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/common/StatusBadge';

const statuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];

const Dashboard = () => {
  const { user } = useAuth();
  const [apps, setApps]         = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/applications/me'),
      api.get('/interviews'),
    ]).then(([a, i]) => {
      setApps(a.data.data);
      setInterviews(i.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const count = (s) => apps.filter(a => a.status === s).length;

  const stats = [
    { label: 'Total Applied',  value: apps.length,          color: '#3b82f6' },
    { label: 'Shortlisted',    value: count('Shortlisted'),  color: '#06b6d4' },
    { label: 'Interviews',     value: interviews.length,     color: '#a855f7' },
    { label: 'Selected',       value: count('Selected'),     color: '#22c55e' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Welcome, {user?.name} 👋</h1>
        <p style={s.sub}>Here's your application overview</p>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        {stats.map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={{ ...s.statVal, color: st.color }}>{loading ? '—' : st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div style={s.section}>
        <div style={s.secHead}>
          <h2 style={s.secTitle}>Recent Applications</h2>
          <Link to="/my-applications" style={s.viewAll}>View All →</Link>
        </div>
        {loading ? <p style={s.msg}>Loading...</p> :
         apps.length === 0 ? <p style={s.msg}>No applications yet. <Link to="/jobs" style={s.link}>Browse jobs</Link></p> :
        <div style={s.table}>
          {apps.slice(0, 5).map(app => (
            <Link to={`/my-applications/${app._id}`} key={app._id} style={s.row}>
              <div>
                <div style={s.jobTitle}>{app.job?.title}</div>
                <div style={s.jobBranch}>{app.job?.branch?.name || 'Remote'}</div>
              </div>
              <StatusBadge status={app.status} />
            </Link>
          ))}
        </div>}
      </div>

      {/* Upcoming Interviews */}
      <div style={s.section}>
        <h2 style={s.secTitle}>Upcoming Interviews</h2>
        {loading ? <p style={s.msg}>Loading...</p> :
         interviews.length === 0 ? <p style={s.msg}>No interviews scheduled yet.</p> :
        <div style={s.table}>
          {interviews.slice(0, 3).map(iv => (
            <div key={iv._id} style={s.row}>
              <div>
                <div style={s.jobTitle}>{iv.application?.job?.title || 'Interview'}</div>
                <div style={s.jobBranch}>{iv.message}</div>
              </div>
              <div style={s.dateTag}>{iv.date ? new Date(iv.date).toLocaleDateString() : 'No Date'} · {iv.time}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

const s = {
  page:      { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  header:    { marginBottom: '2rem' },
  title:     { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' },
  sub:       { color: '#64748b', marginTop: '0.3rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2.5rem' },
  statCard:  { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' },
  statVal:   { fontFamily: "'Syne',sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' },
  statLabel: { color: '#64748b', fontSize: '0.82rem', fontWeight: 500 },
  section:   { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
  secHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  secTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' },
  viewAll:   { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  table:     { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  row:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: '#0a0f1e', borderRadius: '8px', border: '1px solid #1e2d45', color: 'inherit' },
  jobTitle:  { fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9', marginBottom: '0.2rem' },
  jobBranch: { color: '#64748b', fontSize: '0.78rem' },
  dateTag:   { color: '#a855f7', fontSize: '0.82rem', fontWeight: 600 },
  msg:       { color: '#64748b', fontSize: '0.9rem' },
  link:      { color: '#3b82f6', fontWeight: 600 },
};

export default Dashboard;