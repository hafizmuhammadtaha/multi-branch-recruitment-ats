import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import StatusBadge from '../../components/common/StatusBadge';

const HRDashboard = () => {
  const [jobs, setJobs]         = useState([]);
  const [apps, setApps]         = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications'),
      api.get('/interviews'),
    ]).then(([j, a, i]) => {
      setJobs(j.data.data);
      setApps(a.data.data);
      setInterviews(i.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Active Jobs',       value: jobs.length,       color: '#3b82f6' },
    { label: 'Total Applications',value: apps.length,       color: '#06b6d4' },
    { label: 'Shortlisted',       value: apps.filter(a => a.status === 'Shortlisted').length, color: '#a855f7' },
    { label: 'Interviews',        value: interviews.length, color: '#22c55e' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>HR Dashboard</h1>
        <Link to="/hr/jobs/create" style={s.btn}>+ Post New Job</Link>
      </div>

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
          <Link to="/hr/applications" style={s.viewAll}>View All →</Link>
        </div>
        {loading ? <p style={s.msg}>Loading...</p> :
         apps.length === 0 ? <p style={s.msg}>No applications yet.</p> :
        <div style={s.table}>
          {apps.slice(0, 6).map(app => (
            <Link to={`/hr/applications/${app._id}`} key={app._id} style={s.row}>
              <div>
                <div style={s.name}>{app.candidate?.name}</div>
                <div style={s.sub}>{app.job?.title}</div>
              </div>
              <StatusBadge status={app.status} />
            </Link>
          ))}
        </div>}
      </div>

      {/* Upcoming Interviews */}
      <div style={s.section}>
        <div style={s.secHead}>
          <h2 style={s.secTitle}>Upcoming Interviews</h2>
          <Link to="/hr/interviews" style={s.viewAll}>View All →</Link>
        </div>
        {loading ? <p style={s.msg}>Loading...</p> :
         interviews.length === 0 ? <p style={s.msg}>No interviews scheduled.</p> :
        <div style={s.table}>
          {interviews.slice(0, 4).map(iv => (
            <div key={iv._id} style={s.row}>
              <div>
                <div style={s.name}>{iv.application?.candidate?.name}</div>
                <div style={s.sub}>{iv.application?.job?.title}</div>
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
  page:      { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title:     { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' },
  btn:       { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', padding: '0.6rem 1.3rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard:  { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' },
  statVal:   { fontFamily: "'Syne',sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' },
  statLabel: { color: '#64748b', fontSize: '0.82rem' },
  section:   { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
  secHead:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  secTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' },
  viewAll:   { color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600 },
  table:     { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  row:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: '#0a0f1e', borderRadius: '8px', border: '1px solid #1e2d45', color: 'inherit' },
  name:      { fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9', marginBottom: '0.2rem' },
  sub:       { color: '#64748b', fontSize: '0.78rem' },
  dateTag:   { color: '#a855f7', fontSize: '0.82rem', fontWeight: 600 },
  msg:       { color: '#64748b', fontSize: '0.9rem' },
};

export default HRDashboard;