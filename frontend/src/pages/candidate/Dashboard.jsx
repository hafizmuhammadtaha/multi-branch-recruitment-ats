import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, UserCircle, ArrowRight, FileText } from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/applications/me');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalApplications = applications.length;
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Helper to get branch name — branch may be populated or just an ID
  const getBranchName = (job) => {
    if (!job) return 'Unknown';
    if (typeof job.branch === 'object' && job.branch?.name) return job.branch.name;
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Here is a summary of your recent activity.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-primary-50 text-primary-600 p-4 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applied</p>
            <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Under Review</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts['Under Review'] || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-50 text-yellow-600 p-4 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Shortlisted</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts['Shortlisted'] || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Interviews</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts['Interview Scheduled'] || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="p-8">
              <EmptyState message="You haven't applied to any jobs yet. Browse open positions to get started!" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{app.job?.title || 'Job Deleted'}</td>
                      <td className="px-6 py-4 text-gray-500">{getBranchName(app.job)}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="space-y-4">
            <Link to="/" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <Briefcase size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">Browse Jobs</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
            
            <Link to="/candidate/interviews" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <CalendarDays size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">My Interviews</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
            
            <Link to="/candidate/profile" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <UserCircle size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">Edit Profile</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
