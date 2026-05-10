import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import StatusBadge from '../../components/common/StatusBadge';

const statuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];

const HRAppDetail = () => {
  const { id } = useParams();
  const [app, setApp]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('');
  const [interview, setInterview] = useState({ date: '', time: '', message: '' });
  const [message, setMessage]   = useState({ subject: '', message: '' });
  const [saving, setSaving]     = useState('');

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(r => { setApp(r.data.data); setStatus(r.data.data.status); })
      .catch(() => toast.error('Application not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async () => {
    setSaving('status');
    try {
      await api.put(`/applications/${id}/status`, { status });
      setApp(prev => ({ ...prev, status }));
      toast.success('Status updated!');
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(''); }
  };

  const scheduleInterview = async () => {
    if (!interview.date || !interview.time) { toast.error('Date and time required'); return; }
    setSaving('interview');
    try {
      await api.post('/interviews', { applicationId: id, ...interview });
      toast.success('Interview scheduled & email sent!');
      setApp(prev => ({ ...prev, status: 'Interview Scheduled' }));
      setStatus('Interview Scheduled');
    } catch { toast.error('Failed to schedule interview'); }
    finally { setSaving(''); }
  };

  const sendMessage = async () => {
    if (!message.message) { toast.error('Message is required'); return; }
    setSaving('message');
    try {
      await api.post(`/applications/${id}/message`, message);
      toast.success('Message sent!');
      setMessage({ subject: '', message: '' });
    } catch { toast.error('Failed to send message'); }
    finally { setSaving(''); }
  };

  if (loading) return <p style={s.msg}>Loading...</p>;
  if (!app)    return <p style={s.msg}>Application not found.</p>;

  return (
    <div style={s.page}>
      <Link to="/hr/applications" style={s.back}>← Back to Applications</Link>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>{app.job?.title}</h1>
          <p style={s.sub}>{app.candidate?.name} · {app.candidate?.email}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div style={s.grid}>
        {/* Left Column */}
        <div style={s.col}>

          {/* Documents */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Documents</h3>
            <div style={s.docs}>
              {app.resumeUrl
                ? <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={s.docBtn}>📄 View Resume</a>
                : <span style={s.noDoc}>No resume</span>}
              {app.coverLetterUrl
                ? <a href={app.coverLetterUrl} target="_blank" rel="noreferrer" style={s.docBtn}>📝 Cover Letter</a>
                : <span style={s.noDoc}>No cover letter</span>}
            </div>
          </div>

          {/* Update Status */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Update Status</h3>
            <div style={s.row}>
              <select value={status} onChange={e => setStatus(e.target.value)} style={s.input}>
                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
              <button onClick={updateStatus} disabled={saving === 'status'} style={s.btn}>
                {saving === 'status' ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Send Custom Message */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Send Message to Candidate</h3>
            <div style={s.form}>
              <input
                placeholder="Subject (optional)"
                value={message.subject}
                onChange={e => setMessage({ ...message, subject: e.target.value })}
                style={s.input}
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                value={message.message}
                onChange={e => setMessage({ ...message, message: e.target.value })}
                style={{ ...s.input, resize: 'vertical' }}
              />
              <button onClick={sendMessage} disabled={saving === 'message'} style={s.btn}>
                {saving === 'message' ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column — Schedule Interview */}
        <div style={s.col}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Schedule Interview</h3>
            <div style={s.form}>
              <div style={s.field}>
                <label style={s.label}>Date</label>
                <input type="date" value={interview.date} onChange={e => setInterview({ ...interview, date: e.target.value })} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Time</label>
                <input type="time" value={interview.time} onChange={e => setInterview({ ...interview, time: e.target.value })} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Message to Candidate</label>
                <textarea
                  rows={4}
                  placeholder="Interview details, location, instructions..."
                  value={interview.message}
                  onChange={e => setInterview({ ...interview, message: e.target.value })}
                  style={{ ...s.input, resize: 'vertical' }}
                />
              </div>
              <button onClick={scheduleInterview} disabled={saving === 'interview'} style={s.btnPurple}>
                {saving === 'interview' ? 'Scheduling...' : 'Schedule & Notify Candidate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page:      { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  back:      { color: '#64748b', fontSize: '0.85rem', display: 'inline-block', marginBottom: '1.5rem' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  title:     { fontFamily: "'Syne',sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.4rem' },
  sub:       { color: '#64748b', fontSize: '0.88rem' },
  grid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' },
  col:       { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  card:      { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem' },
  cardTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '1rem' },
  docs:      { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  docBtn:    { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600 },
  noDoc:     { color: '#64748b', fontSize: '0.85rem' },
  row:       { display: 'flex', gap: '0.8rem' },
  form:      { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  field:     { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label:     { fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input:     { background: '#0a0f1e', border: '1px solid #1e2d45', borderRadius: '7px', padding: '0.65rem 0.9rem', color: '#f1f5f9', fontSize: '0.88rem', outline: 'none', width: '100%' },
  btn:       { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.65rem 1.2rem', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' },
  btnPurple: { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '7px', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 700 },
  msg:       { color: '#64748b', padding: '3rem', textAlign: 'center' },
};

export default HRAppDetail;