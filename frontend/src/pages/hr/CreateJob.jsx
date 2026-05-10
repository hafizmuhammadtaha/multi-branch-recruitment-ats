import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const CreateJob = () => {
  const nav = useNavigate();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', branch: '', availableSeats: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/branches').then(r => setBranches(r.data.data));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/jobs', { ...form, availableSeats: Number(form.availableSeats) });
      toast.success('Job posted successfully!');
      nav('/hr/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Post New Job</h1>
      <p style={s.sub}>Fill in the details below to create a new job posting</p>

      <div style={s.card}>
        <form onSubmit={onSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Job Title</label>
            <input name="title" required value={form.title} onChange={onChange} placeholder="e.g. Frontend Developer" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea name="description" required rows={5} value={form.description} onChange={onChange} placeholder="Describe the role, responsibilities, and requirements..." style={{ ...s.input, resize: 'vertical' }} />
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Branch</label>
              <select name="branch" required value={form.branch} onChange={onChange} style={s.input}>
                <option value="">Select branch</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Available Seats</label>
              <input name="availableSeats" type="number" min={1} required value={form.availableSeats} onChange={onChange} placeholder="e.g. 3" style={s.input} />
            </div>
          </div>
          <div style={s.btns}>
            <button type="button" onClick={() => nav('/hr/jobs')} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={s.submitBtn}>{saving ? 'Posting...' : 'Post Job'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const s = {
  page:      { maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' },
  title:     { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:       { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  card:      { background: '#111827', border: '1px solid #1e2d45', borderRadius: '14px', padding: '2rem' },
  form:      { display: 'flex', flexDirection: 'column', gap: '1.3rem' },
  field:     { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  label:     { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' },
  input:     { background: '#0a0f1e', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  row:       { display: 'flex', gap: '1rem' },
  btns:      { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn: { background: 'transparent', border: '1px solid #1e2d45', color: '#94a3b8', padding: '0.7rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 },
  submitBtn: { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', border: 'none', padding: '0.7rem 1.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700 },
};

export default CreateJob;