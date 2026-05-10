import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    nav('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>TalentFlow</Link>

      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Jobs</Link>

        {!user && <>
          <Link to="/login"    style={styles.link}>Login</Link>
          <Link to="/register" style={styles.btn}>Register</Link>
        </>}

        {user?.role === 'candidate' && <>
          <Link to="/dashboard"       style={styles.link}>Dashboard</Link>
          <Link to="/my-applications" style={styles.link}>Applications</Link>
          <Link to="/my-interviews"   style={styles.link}>Interviews</Link>
          <Link to="/profile"         style={styles.link}>Profile</Link>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </>}

        {(user?.role === 'hr' || user?.role === 'admin') && <>
          {user?.role === 'admin'
            ? <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            : <Link to="/hr/dashboard"    style={styles.link}>Dashboard</Link>
          }
          <Link to="/hr/jobs"         style={styles.link}>Jobs</Link>
          <Link to="/hr/applications" style={styles.link}>Applications</Link>
          <Link to="/hr/interviews"   style={styles.link}>Interviews</Link>
          {user?.role === 'admin' &&
            <Link to="/admin/branches" style={styles.link}>Branches</Link>}
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </>}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
    background: '#0d1425',
    borderBottom: '1px solid #1e2d45',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '1.3rem',
    background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  btn: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    color: '#fff',
    border: 'none',
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
};

export default Navbar;