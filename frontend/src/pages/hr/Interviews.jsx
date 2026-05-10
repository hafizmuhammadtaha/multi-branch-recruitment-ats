import { useEffect, useState } from 'react';
import api from '../../utils/axios';

const HRInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get('/interviews').then(r => setInterviews(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <h1 style={s.title}>All Interviews</h1>
      <p style={s.sub}>{interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled</p>

      {loading ? <p style={s.msg}>Loading...</p> :
       interviews.length === 0 ? <p style={s.msg}>No interviews scheduled yet.</p> :
      <div style={s.list}>
        {interviews.map(iv => (
          <div key={iv._id} style={s.card}>
            <div style={s.left}>
              <div style={s.tag}>Interview</div>
              <h3 style={s.name}>{iv.application?.candidate?.name}</h3>
              <p style={s.email}>{iv.application?.candidate?.email}</p>
              <p style={s.jobTitle}>{iv.application?.job?.title}</p>
              {iv.message && <p style={s.message}>"{iv.message}"</p>}
            </div>
            <div style={s.dateBox}>
              <div style={s.dateVal}>{iv.date ? new Date(iv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Date'}</div>
              <div style={s.timeVal}>{iv.time}</div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

const s = {
  page:     { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  title:    { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:      { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  list:     { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card:     { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left:     { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  tag:      { display: 'inline-block', background: 'rgba(168,85,247,0.12)', color: '#a855f7', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  name:     { fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' },
  email:    { color: '#64748b', fontSize: '0.78rem' },
  jobTitle: { color: '#06b6d4', fontSize: '0.82rem', fontWeight: 600 },
  message:  { color: '#64748b', fontSize: '0.82rem', fontStyle: 'italic' },
  dateBox:  { background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '0.8rem 1.2rem', textAlign: 'center', flexShrink: 0 },
  dateVal:  { color: '#a855f7', fontWeight: 700, fontSize: '0.9rem' },
  timeVal:  { color: '#64748b', fontSize: '0.78rem', marginTop: '0.2rem' },
  msg:      { color: '#64748b', fontSize: '0.9rem' },
};

export default HRInterviews;