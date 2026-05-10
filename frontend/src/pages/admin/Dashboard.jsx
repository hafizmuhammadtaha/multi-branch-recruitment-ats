import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CalendarDays, Building2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    interviews: 0,
    branches: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, appsRes, interviewsRes, branchesRes] = await Promise.all([
        api.get('/api/jobs'),
        api.get('/api/applications'),
        api.get('/api/interviews'),
        api.get('/api/branches')
      ]);

      let apps = [];
      if (appsRes.data.success) apps = appsRes.data.data || [];

      setStats({
        jobs: jobsRes.data.success ? (jobsRes.data.data || []).length : 0,
        applications: apps.length,
        interviews: interviewsRes.data.success ? (interviewsRes.data.data || []).length : 0,
        branches: branchesRes.data.success ? (branchesRes.data.data || []).length : 0
      });

      setRecentApplications(
        [...apps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
      );
    } catch (error) {
      console.error('Failed to fetch admin dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Full system overview and management.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-primary-50 text-primary-600 p-4 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Branches</p>
            <p className="text-2xl font-bold text-gray-900">{stats.branches}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.jobs}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Interviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link to="/hr/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="p-8">
              <EmptyState message="No applications received yet." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.candidate?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{app.candidate?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{app.job?.title || 'Job Deleted'}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="space-y-4">
            <Link to="/admin/branches" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <Building2 size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">Manage Branches</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>

            <Link to="/hr/jobs/create" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <Briefcase size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">Post a Job</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
            
            <Link to="/hr/applications" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                  <Users size={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary-700">Review Applications</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
