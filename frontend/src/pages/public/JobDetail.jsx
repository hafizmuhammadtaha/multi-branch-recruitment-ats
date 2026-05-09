import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

const JobDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume]   = useState(null);
  const [cover, setCover]     = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { nav('/login'); return; }
    if (!resume) { toast.error('Please upload your resume'); return; }
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      fd.append('resume', resume);
      if (cover) fd.append('coverLetter', cover);
      await api.post('/applications', fd);
      toast.success('Application submitted!');
      nav('/my-applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={{ color: '#64748b', padding: '3rem', textAlign: 'center' }}>Loading...</p>;
  if (!job)    return <p style={{ color: '#ef4444', padding: '3rem', textAlign: 'center' }}>Job not found.</p>;

  return (
    <div style={s.page}>
      <Link to="/jobs" style={s.back}>← Back to Jobs</Link>

      <div style={s.layout}>
        {/* Left — Job Info */}
        <div style={s.info}>
          <span style={s.branch}>{job.branch?.name || 'Remote'}</span>
          <h1 style={s.title}>{job.title}</h1>
          <div style={s.meta}>
            <span style={s.metaItem}>🪑 {job.availableSeats} seats available</span>
          </div>
          <div style={s.divider} />
          <h3 style={s.secLabel}>Job Description</h3>
          <p style={s.desc}>{job.description}</p>
        </div>

        {/* Right — Apply Box */}
        <div style={s.applyBox}>
          <h3 style={s.applyTitle}>Apply for this Role</h3>

          {!user && (
            <p style={s.loginNote}>
              <Link to="/login" style={s.link}>Login</Link> or{' '}
              <Link to="/register" style={s.link}>Register</Link> to apply
            </p>
          )}

          {user?.role === 'candidate' && <>
            <div style={s.field}>
              <label style={s.label}>Resume <span style={s.req}>*</span></label>
              <input
                type="file" accept=".pdf"
                onChange={e => setResume(e.target.files[0])}
                style={s.fileInput}
              />
              <small style={s.hint}>PDF only</small>
            </div>
            <div style={s.field}>
              <label style={s.label}>Cover Letter <span style={s.opt}>(optional)</span></label>
              <input
                type="file" accept=".pdf,.docx"
                onChange={e => setCover(e.target.files[0])}
                style={s.fileInput}
              />
              <small style={s.hint}>PDF or DOCX</small>
            </div>
            <button onClick={handleApply} disabled={applying} style={s.applyBtn}>
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </>}

          {user?.role !== 'candidate' && user && (
            <p style={s.loginNote}>Only candidates can apply for jobs.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  back: { color: '#64748b', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' },
  info: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
    padding: '2rem',
  },
  branch: {
    background: 'rgba(6,182,212,0.1)',
    color: '#06b6d4',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.25rem 0.7rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '0.8rem',
  },
  meta: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  metaItem: { color: '#64748b', fontSize: '0.85rem' },
  divider: { borderTop: '1px solid #1e2d45', margin: '1.5rem 0' },
  secLabel: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    color: '#94a3b8',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '0.8rem',
  },
  desc: { color: '#94a3b8', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' },
  applyBox: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
    padding: '1.8rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    position: 'sticky',
    top: '80px',
  },
  applyTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#f1f5f9',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' },
  req: { color: '#ef4444' },
  opt: { color: '#64748b', fontWeight: 400 },
  fileInput: { color: '#94a3b8', fontSize: '0.85rem' },
  hint: { color: '#64748b', fontSize: '0.75rem' },
  applyBtn: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    marginTop: '0.5rem',
  },
  loginNote: { color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 },
  link: { color: '#3b82f6', fontWeight: 600 },
};

export default JobDetail;