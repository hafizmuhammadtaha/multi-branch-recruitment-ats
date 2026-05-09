import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [pic, setPic]         = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.get('/users/me').then(r => {
      const u = r.data.data;
      setForm({ name: u.name, email: u.email, password: '' });
      setPreview(u.profilePicUrl || '');
    }).finally(() => setLoading(false));
  }, []);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onPicChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPic(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name',  form.name);
      fd.append('email', form.email);
      if (form.password) fd.append('password', form.password);
      if (pic) fd.append('profilePic', pic);
      await api.put('/users/me', fd);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={s.msg}>Loading...</p>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Profile</h1>
      <p style={s.sub}>Update your personal information</p>

      <div style={s.card}>
        {/* Profile Picture */}
        <div style={s.picSection}>
          <div style={s.avatar}>
            {preview
              ? <img src={preview} alt="profile" style={s.avatarImg} />
              : <div style={s.avatarPlaceholder}>{form.name?.[0]?.toUpperCase()}</div>
            }
          </div>
          <div>
            <input type="file" accept="image/*" id="picInput" onChange={onPicChange} style={{ display: 'none' }} />
            <label htmlFor="picInput" style={s.picBtn}>Change Photo</label>
            <p style={s.picHint}>JPG, PNG or WEBP · Max 2MB</p>
          </div>
        </div>

        <div style={s.divider} />

        <form onSubmit={onSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input name="name" value={form.name} onChange={onChange} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>New Password <span style={{ color: '#64748b', fontWeight: 400 }}>(leave blank to keep current)</span></label>
            <input name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" style={s.input} />
          </div>
          <button type="submit" disabled={saving} style={s.btn}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  page:              { maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' },
  title:             { fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.3rem' },
  sub:               { color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' },
  card:              { background: '#111827', border: '1px solid #1e2d45', borderRadius: '14px', padding: '2rem' },
  picSection:        { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' },
  avatar:            { width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #1e2d45', flexShrink: 0 },
  avatarImg:         { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#fff' },
  picBtn:            { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', padding: '0.45rem 1rem', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-block' },
  picHint:           { color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem' },
  divider:           { borderTop: '1px solid #1e2d45', margin: '1.5rem 0' },
  form:              { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field:             { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label:             { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' },
  input:             { background: '#0a0f1e', border: '1px solid #1e2d45', borderRadius: '8px', padding: '0.7rem 1rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  btn:               { marginTop: '0.5rem', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700 },
  msg:               { color: '#64748b', padding: '3rem', textAlign: 'center' },
};

export default Profile;