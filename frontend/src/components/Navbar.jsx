import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, role, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'hr') return '/hr/dashboard';
    if (role === 'candidate') return '/candidate/dashboard';
    return '/';
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Briefcase size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">TechVista ATS</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hi, <span className="font-medium text-gray-700">{user?.name}</span>
                </span>
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
