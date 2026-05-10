import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const ManageJobs = () => {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    api.get('/jobs').then(r => setJobs(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Manage Jobs</h1>
          <p style={s.sub}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/hr/jobs/create" style={s.btn}>+ Post New Job</Link>
      </div>

      {loading ? <p style={s.msg}>Loading...</p> :
       jobs.length === 0 ? <p style={s.msg}>No jobs posted yet.</p> :
      <div style={s.list}>
        {jobs.map(job => (
          <div key={job._id} style={s.card}>
            <div style={s.cardLeft}>
              <span style={s.branch}>{job.branch?.name || 'Remote'}</span>
              <h3 style={s.jobTitle}>{job.title}</h3>
              <p style={s.desc}>{job.description?.slice(0, 100)}...</p>
              <span style={s.seats}>{job.availableSeats} seats available</span>
            </div>
            <div style={s.actions}>
              <Link to={`/hr/jobs/${job._id}/edit`} style={s.editBtn}>Edit</Link>
              <button onClick={() => handleDelete(job._id)} style={s.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

const s = {
  page:     { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title:    { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:      { color: '#64748b', fontSize: '0.9rem' },
  btn:      { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', padding: '0.65rem 1.3rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem' },
  list:     { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card:     { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  cardLeft: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  branch:   { display: 'inline-block', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  jobTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' },
  desc:     { color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 },
  seats:    { color: '#94a3b8', fontSize: '0.78rem' },
  actions:  { display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 },
  editBtn:  { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', padding: '0.45rem 1rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' },
  deleteBtn:{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.45rem 1rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600 },
  msg:      { color: '#64748b', fontSize: '0.9rem' },
};

export default ManageJobs;