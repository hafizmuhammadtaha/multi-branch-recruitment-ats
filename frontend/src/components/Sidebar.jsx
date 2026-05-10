import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  CalendarDays, 
  Building2, 
  UserCircle,
  LogOut,
  Menu,
  X 
} from 'lucide-react';

const Sidebar = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (role) {
      case 'candidate':
        return [
          { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
          { name: 'My Applications', path: '/candidate/applications', icon: Briefcase },
          { name: 'My Interviews', path: '/candidate/interviews', icon: CalendarDays },
          { name: 'Profile', path: '/candidate/profile', icon: UserCircle },
        ];
      case 'hr':
        return [
          { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
          { name: 'Jobs', path: '/hr/jobs', icon: Briefcase },
          { name: 'Applications', path: '/hr/applications', icon: Users },
          { name: 'Interviews', path: '/hr/interviews', icon: CalendarDays },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Jobs', path: '/hr/jobs', icon: Briefcase },
          { name: 'Applications', path: '/hr/applications', icon: Users },
          { name: 'Interviews', path: '/hr/interviews', icon: CalendarDays },
          { name: 'Branches', path: '/admin/branches', icon: Building2 },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  const sidebarContent = (
    <div className="py-6 px-4 flex flex-col h-full">
      <div className="space-y-1 flex-1">
        {links.map((link) => {
          const IconComp = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComp size={20} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - desktop always visible, mobile slides in */}
      <aside className={`
        fixed md:sticky top-0 md:top-16 left-0 z-40 w-64 bg-white border-r border-gray-100 
        h-screen md:h-[calc(100vh-4rem)] transform transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
