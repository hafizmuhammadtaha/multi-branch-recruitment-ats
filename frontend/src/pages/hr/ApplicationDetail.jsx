import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, ExternalLink, Mail, Calendar, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [messaging, setMessaging] = useState(false);

  const { register: regInterview, handleSubmit: submitInterview, reset: resetInterview, formState: { errors: errInterview } } = useForm();
  const { register: regMsg, handleSubmit: submitMsg, reset: resetMsg, formState: { errors: errMsg } } = useForm();

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/api/applications/${id}`);
      if (res.data.success) {
        setApplication(res.data.data);
        setSelectedStatus(res.data.data.status);
      }
    } catch (error) {
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === application.status) return;
    
    setStatusUpdating(true);
    try {
      const res = await api.put(`/api/applications/${id}/status`, { status: selectedStatus });
      if (res.data.success) {
        toast.success(`Status updated to ${selectedStatus}`);
        setApplication(prev => ({ ...prev, status: selectedStatus }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const onScheduleInterview = async (data) => {
    setScheduling(true);
    try {
      const payload = { ...data, applicationId: id };
      const res = await api.post('/api/interviews', payload);
      if (res.data.success) {
        toast.success('Interview scheduled successfully');
        resetInterview();
        fetchApplication();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  const onSendMessage = async (data) => {
    setMessaging(true);
    try {
      const res = await api.post(`/api/applications/${id}/message`, data);
      if (res.data.success) {
        toast.success('Message sent successfully');
        resetMsg();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setMessaging(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!application) return <div className="p-12 text-center text-gray-500">Application not found</div>;

  const getBranchName = (job) => {
    if (!job) return 'Unknown';
    if (typeof job.branch === 'object' && job.branch?.name) return job.branch.name;
    return 'N/A';
  };

  const showInterviewForm = ['Shortlisted', 'Under Review', 'Interview Scheduled'].includes(application.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link to="/hr/applications" className="p-2 bg-white text-gray-500 hover:text-primary-600 rounded-xl border border-gray-200 shadow-sm transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
          <p className="text-gray-500 mt-1">Review applicant information and take action.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{application.candidate?.name || 'Unknown'}</h2>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <Mail size={16} />
                    <a href={`mailto:${application.candidate?.email}`} className="hover:text-primary-600 transition-colors">
                      {application.candidate?.email || ''}
                    </a>
                  </div>
                </div>
                <StatusBadge status={application.status} />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-500">Applied Job</p>
                  <p className="font-semibold text-gray-900 mt-1">{application.job?.title || 'Unknown Job'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="font-semibold text-gray-900 mt-1">{application.job?.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Branch</p>
                  <p className="font-semibold text-gray-900 mt-1">{getBranchName(application.job)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Applied Date</p>
                  <p className="font-semibold text-gray-900 mt-1">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
                <div className="flex flex-wrap gap-4">
                  {application.resumeUrl && (
                    <a 
                      href={application.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm"
                    >
                      <FileText size={20} className="text-blue-500" />
                      View Resume
                      <ExternalLink size={16} className="text-gray-400 ml-1" />
                    </a>
                  )}
                  {application.coverLetterUrl && (
                    <a 
                      href={application.coverLetterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm"
                    >
                      <FileText size={20} className="text-indigo-500" />
                      View Cover Letter
                      <ExternalLink size={16} className="text-gray-400 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Send Custom Message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-gray-400" /> Send Message to Candidate
            </h3>
            <form onSubmit={submitMsg(onSendMessage)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Subject (Optional)"
                  {...regMsg('subject')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Type your message here..."
                  {...regMsg('message', { required: 'Message is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y text-sm"
                ></textarea>
                {errMsg.message && <p className="mt-1 text-sm text-red-600">{errMsg.message.message}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={messaging}
                  className="px-5 py-2.5 bg-primary-600 border border-transparent rounded-xl text-white font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {messaging ? <Loader2 size={18} className="animate-spin" /> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-gray-400" /> Update Status
            </h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={statusUpdating}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mb-3"
            >
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={statusUpdating || selectedStatus === application.status}
              className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {statusUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Update Status'}
            </button>
            <p className="text-xs text-gray-500 mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
              Changing status to Shortlisted, Rejected, or Selected will auto-notify the candidate via email.
            </p>
          </div>

          {/* Schedule Interview */}
          {showInterviewForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-primary-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary-500" /> Schedule Interview
              </h3>
              <form onSubmit={submitInterview(onScheduleInterview)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    {...regInterview('date', { required: 'Date is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  />
                  {errInterview.date && <p className="mt-1 text-sm text-red-600">{errInterview.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    {...regInterview('time', { required: 'Time is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  />
                  {errInterview.time && <p className="mt-1 text-sm text-red-600">{errInterview.time.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Interview details, meet link, etc."
                    {...regInterview('message')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="w-full px-4 py-2.5 bg-primary-600 border border-transparent rounded-xl text-white font-medium hover:bg-primary-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {scheduling ? <Loader2 size={18} className="animate-spin" /> : 'Schedule Interview'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
