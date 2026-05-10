import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Building2, MapPin, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/branches');
      if (res.data.success) {
        setBranches(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/api/branches', data);
      if (res.data.success) {
        toast.success('Branch added successfully');
        setIsModalOpen(false);
        reset();
        fetchBranches();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add branch');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-500 mt-1">Add and manage company branches.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Branch
        </button>
      </div>

      {branches.length === 0 ? (
        <EmptyState message="No branches have been added yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <div key={branch._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-50 text-primary-600 p-3 rounded-xl">
                  <Building2 size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{branch.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin size={16} />
                <span>Created {new Date(branch.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Add New Branch</h3>
              <button 
                onClick={() => !isSubmitting && setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('name', { required: 'Branch name is required' })}
                  placeholder="e.g. New York Office"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 flex items-center justify-center min-w-[120px] bg-primary-600 border border-transparent rounded-xl text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
