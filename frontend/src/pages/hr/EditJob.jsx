import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'HR', 'QA', 'DevOps', 'Management', 'Finance', 'Sales', 'Support'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [jobRes, branchesRes] = await Promise.all([
        api.get(`/api/jobs/${id}`),
        api.get('/api/branches')
      ]);

      if (branchesRes.data.success) {
        setBranches(branchesRes.data.data);
      }

      if (jobRes.data.success) {
        const job = jobRes.data.data;
        setValue('title', job.title);
        setValue('description', job.description);
        setValue('department', job.department || '');
        setValue('availableSeats', job.availableSeats);
        setValue('branch', job.branch?._id || job.branch);
      }
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/hr/jobs');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      data.availableSeats = parseInt(data.availableSeats, 10);
      
      const res = await api.put(`/api/jobs/${id}`, data);
      if (res.data.success) {
        toast.success('Job updated successfully');
        navigate('/hr/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/hr/jobs" className="p-2 bg-white text-gray-500 hover:text-primary-600 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-500 mt-1">Update job posting details.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('title', { required: 'Job title is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
              <select
                {...register('department', { required: 'Department is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch <span className="text-red-500">*</span></label>
              <select
                {...register('branch', { required: 'Branch is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                {...register('availableSeats', { 
                  required: 'Available seats is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
              {errors.availableSeats && <p className="mt-1 text-sm text-red-600">{errors.availableSeats.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-red-500">*</span></label>
              <textarea
                rows="8"
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link
              to="/hr/jobs"
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 border border-transparent rounded-xl text-white font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
