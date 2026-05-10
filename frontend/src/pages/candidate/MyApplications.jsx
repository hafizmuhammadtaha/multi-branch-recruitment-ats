import React, { useState, useEffect } from 'react';
import { ExternalLink, Briefcase, FileText, Calendar } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const MyApplications = () => {
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

  const getBranchName = (job) => {
    if (!job) return 'Unknown';
    if (typeof job.branch === 'object' && job.branch?.name) return job.branch.name;
    return 'N/A';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState message="You haven't applied to any jobs yet." />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="bg-primary-50 p-4 rounded-xl text-primary-600 hidden md:block">
                <Briefcase size={28} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{app.job?.title || 'Job Deleted'}</h3>
                  <StatusBadge status={app.status} />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div>Branch: {getBranchName(app.job)}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {app.resumeUrl && (
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FileText size={16} />
                      View Resume
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                  {app.coverLetterUrl && (
                    <a 
                      href={app.coverLetterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <FileText size={16} />
                      Cover Letter
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
