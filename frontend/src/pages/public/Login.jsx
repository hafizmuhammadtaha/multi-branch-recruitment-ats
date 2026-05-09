import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'candidate') nav('/dashboard');
      else if (data.role === 'hr')   nav('/hr/dashboard');
      else if (data.role === 'admin') nav('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.badge}>ATS Portal</div>
        <h1 style={s.title}>Welcome Back</h1>
        <p style={s.sub}>Sign in to your account</p>

        <form onSubmit={onSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              name="email" type="email" required
              value={form.email} onChange={onChange}
              placeholder="you@example.com" style={s.input}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              name="password" type="password" required
              value={form.password} onChange={onChange}
              placeholder="••••••••" style={s.input}
            />
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={s.foot}>
          No account?{' '}
          <Link to="/register" style={s.footLink}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 60% 20%, #0f2044 0%, #0a0f1e 70%)',
    padding: '2rem',
  },
  card: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    marginBottom: '1.2rem',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '0.4rem',
  },
  sub: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.03em' },
  input: {
    background: '#0a0f1e',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    color: '#f1f5f9',
    fontSize: '0.9rem',
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8rem',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  foot: { marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' },
  footLink: { color: '#3b82f6', fontWeight: 600 },
};

export default Login;