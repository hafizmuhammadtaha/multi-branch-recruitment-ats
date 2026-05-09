import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import StatusBadge from '../../components/common/StatusBadge';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(r => setApp(r.data.data))
      .catch(() => toast.error('Application not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={s.msg}>Loading...</p>;
  if (!app)    return <p style={s.msg}>Application not found.</p>;

  return (
    <div style={s.page}>
      <Link to="/my-applications" style={s.back}>← Back to Applications</Link>

      <div style={s.card}>
        <div style={s.cardHead}>
          <div>
            <h1 style={s.title}>{app.job?.title}</h1>
            <div style={s.branch}>{app.job?.branch?.name || 'Remote'}</div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div style={s.divider} />

        <div style={s.grid}>
          <div style={s.infoBlock}>
            <div style={s.label}>Applied On</div>
            <div style={s.value}>{new Date(app.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={s.infoBlock}>
            <div style={s.label}>Available Seats</div>
            <div style={s.value}>{app.job?.availableSeats}</div>
          </div>
        </div>

        <div style={s.divider} />

        <h3 style={s.secLabel}>Documents</h3>
        <div style={s.docs}>
          {app.resumeUrl ? (
            <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={s.docBtn}>
              📄 View Resume
            </a>
          ) : <span style={s.noDoc}>No resume uploaded</span>}

          {app.coverLetterUrl ? (
            <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" style={s.docBtn}>
              📝 View Cover Letter
            </a>
          ) : <span style={s.noDoc}>No cover letter uploaded</span>}
        </div>
      </div>
    </div>
  );
};

const s = {
  page:      { maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' },
  back:      { color: '#64748b', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' },
  card:      { background: '#111827', border: '1px solid #1e2d45', borderRadius: '14px', padding: '2rem' },
  cardHead:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  title:     { fontFamily: "'Syne',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.4rem' },
  branch:    { color: '#06b6d4', fontSize: '0.82rem', fontWeight: 600 },
  divider:   { borderTop: '1px solid #1e2d45', margin: '1.5rem 0' },
  grid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  infoBlock: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label:     { color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' },
  value:     { color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 500 },
  secLabel:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' },
  docs:      { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  docBtn:    { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 },
  noDoc:     { color: '#64748b', fontSize: '0.85rem' },
  msg:       { color: '#64748b', padding: '3rem', textAlign: 'center' },
};

export default ApplicationDetail;