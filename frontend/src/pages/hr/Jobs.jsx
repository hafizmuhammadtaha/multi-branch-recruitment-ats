import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import EmptyState from '../../components/EmptyState';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/api/jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      const res = await api.delete(`/api/jobs/${jobToDelete._id}`);
      if (res.data.success) {
        toast.success('Job deleted successfully');
        fetchJobs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.branch?.name && job.branch.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage job postings.</p>
        </div>
        <Link 
          to="/hr/jobs/create" 
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create New Job
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
              placeholder="Search jobs by title or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="p-8">
            <EmptyState message="No jobs found matching your criteria." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Seats</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map(job => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 text-gray-500">{job.department || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{job.branch?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${job.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.availableSeats}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/hr/jobs/edit/${job._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(job)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Job"
      />
    </div>
  );
};

export default Jobs;
