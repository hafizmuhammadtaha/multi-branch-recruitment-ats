import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, apps: 0, branches: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications'),
      api.get('/branches'),
      api.get('/interviews'),
    ]).then(([j, a, b, i]) => {
      setStats({
        jobs:       j.data.data.length,
        apps:       a.data.data.length,
        branches:   b.data.data.length,
        interviews: i.data.data.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Jobs',         value: stats.jobs,       color: '#3b82f6', link: '/hr/jobs' },
    { label: 'Total Applications', value: stats.apps,       color: '#06b6d4', link: '/hr/applications' },
    { label: 'Branches',           value: stats.branches,   color: '#a855f7', link: '/admin/branches' },
    { label: 'Interviews',         value: stats.interviews, color: '#22c55e', link: '/hr/interviews' },
  ];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.sub}>Full system overview</p>
        </div>
        <Link to="/admin/branches" style={s.btn}>Manage Branches</Link>
      </div>

      <div style={s.grid}>
        {cards.map(c => (
          <Link to={c.link} key={c.label} style={s.card}>
            <div style={{ ...s.val, color: c.color }}>{loading ? '—' : c.value}</div>
            <div style={s.label}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={s.quickLinks}>
        <h2 style={s.secTitle}>Quick Actions</h2>
        <div style={s.actions}>
          <Link to="/hr/jobs/create"   style={s.action}>+ Post New Job</Link>
          <Link to="/hr/applications"  style={s.action}>View Applications</Link>
          <Link to="/hr/interviews"    style={s.action}>View Interviews</Link>
          <Link to="/admin/branches"   style={s.action}>Manage Branches</Link>
        </div>
      </div>
    </div>
  );
};

const s = {
  page:       { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title:      { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:        { color: '#64748b', fontSize: '0.9rem' },
  btn:        { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', padding: '0.65rem 1.3rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '1rem', marginBottom: '2rem' },
  card:       { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.8rem', textAlign: 'center', color: 'inherit', display: 'block' },
  val:        { fontFamily: "'Syne',sans-serif", fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' },
  label:      { color: '#64748b', fontSize: '0.82rem', fontWeight: 500 },
  quickLinks: { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem' },
  secTitle:   { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f1f5f9', marginBottom: '1rem' },
  actions:    { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  action:     { background: '#0a0f1e', border: '1px solid #1e2d45', color: '#94a3b8', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 },
};

export default AdminDashboard;