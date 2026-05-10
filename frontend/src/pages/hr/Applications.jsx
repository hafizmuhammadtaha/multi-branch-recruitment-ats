import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, jobFilter]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      if (res.data.success) {
        setJobs(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load jobs for filter');
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = '/api/applications?';
      if (statusFilter) url += `status=${encodeURIComponent(statusFilter)}&`;
      if (jobFilter) url += `jobId=${encodeURIComponent(jobFilter)}`;
      
      const res = await api.get(url);
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load applications', error);
    } finally {
      setLoading(false);
    }
  };

  const getBranchName = (job) => {
    if (!job) return 'Unknown';
    if (typeof job.branch === 'object' && job.branch?.name) return job.branch.name;
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">Review and manage candidate applications.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-500 mr-2">
            <Filter size={18} />
            <span className="font-medium text-sm">Filters:</span>
          </div>
          
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-sm border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <select
            className="block w-full sm:w-64 pl-3 pr-10 py-2 text-sm border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : applications.length === 0 ? (
          <div className="p-8">
            <EmptyState message="No applications found matching the selected filters." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.candidate?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{app.candidate?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.job?.title || 'Job Deleted'}</td>
                    <td className="px-6 py-4 text-gray-500">{getBranchName(app.job)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/hr/applications/${app._id}`}
                        className="inline-flex items-center justify-center p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
