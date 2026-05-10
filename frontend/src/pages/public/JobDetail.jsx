import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Briefcase, MapPin, Users, Calendar, ArrowLeft, Building, Building2, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import FileUploadInput from '../../components/FileUploadInput';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/api/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Resume is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', resume);
      if (coverLetter) {
        formData.append('coverLetter', coverLetter);
      }

      const res = await api.post('/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Application submitted successfully!');
        setIsModalOpen(false);
        fetchJob();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><LoadingSpinner /></div>;
  if (!job) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><div className="p-12 text-center text-xl text-gray-500">Job not found</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to all jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                {job.availableSeats === 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full border border-red-200">
                    Closed
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-4">
                <div className="flex items-center gap-1.5">
                  <Building size={18} className="text-gray-400" />
                  <span>{job.branch?.name || 'Corporate'}</span>
                </div>
                {job.department && (
                  <div className="flex items-center gap-1.5">
                    <Building2 size={18} className="text-gray-400" />
                    <span>{job.department}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users size={18} className="text-gray-400" />
                  <span>{job.availableSeats} Seats Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              {job.availableSeats === 0 ? (
                <button disabled className="w-full md:w-auto px-8 py-3 bg-gray-200 text-gray-500 rounded-xl font-medium cursor-not-allowed">
                  No Seats Available
                </button>
              ) : !isAuthenticated ? (
                <Link to="/login" className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors">
                  Login to Apply
                </Link>
              ) : role === 'candidate' ? (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm transition-colors"
                >
                  Apply Now
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
          <div className="prose prose-primary max-w-none text-gray-600 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Apply for {job.title}</h3>
              <button 
                onClick={() => !isSubmitting && setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6 space-y-6">
              <div className="space-y-4">
                <FileUploadInput
                  label="Resume (Required)"
                  accept=".pdf"
                  required
                  onChange={(file) => setResume(file)}
                />
                
                <FileUploadInput
                  label="Cover Letter (Optional)"
                  accept=".pdf,.doc,.docx"
                  onChange={(file) => setCoverLetter(file)}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
                <Briefcase className="flex-shrink-0 mt-0.5" size={18} />
                <p>By applying, your profile details will also be shared with the HR team along with these documents.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !resume}
                  className="px-5 py-2.5 flex items-center justify-center min-w-[120px] bg-primary-600 border border-transparent rounded-xl text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
