import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const fetchBranches = () => {
    api.get('/branches').then(r => setBranches(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/branches', { name });
      setBranches(prev => [...prev, data.data]);
      setName('');
      toast.success('Branch created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create branch');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Manage Branches</h1>
      <p style={s.sub}>Add and view company branches</p>

      {/* Create Branch */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Add New Branch</h3>
        <form onSubmit={handleCreate} style={s.form}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Islamabad, Karachi, Remote"
            required
            style={s.input}
          />
          <button type="submit" disabled={saving} style={s.btn}>
            {saving ? 'Creating...' : '+ Add Branch'}
          </button>
        </form>
      </div>

      {/* Branches List */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>All Branches ({branches.length})</h3>
        {loading ? <p style={s.msg}>Loading...</p> :
         branches.length === 0 ? <p style={s.msg}>No branches yet.</p> :
        <div style={s.list}>
          {branches.map((b, i) => (
            <div key={b._id} style={s.row}>
              <div style={s.num}>{i + 1}</div>
              <div style={s.branchName}>{b.name}</div>
              <div style={s.id}>{b._id}</div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

const s = {
  page:       { maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' },
  title:      { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:        { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  card:       { background: '#111827', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
  cardTitle:  { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '1rem' },
  form:       { display: 'flex', gap: '0.8rem' },
  input:      { flex: 1, background: '#0a0f1e', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  btn:        { background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.3rem', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' },
  list:       { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  row:        { display: 'flex', alignItems: 'center', gap: '1rem', background: '#0a0f1e', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.8rem 1rem' },
  num:        { color: '#64748b', fontSize: '0.82rem', fontWeight: 700, minWidth: '24px' },
  branchName: { color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', flex: 1 },
  id:         { color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' },
  msg:        { color: '#64748b', fontSize: '0.9rem' },
};

export default Branches;