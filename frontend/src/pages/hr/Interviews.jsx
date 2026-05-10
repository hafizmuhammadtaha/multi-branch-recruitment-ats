import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Eye } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const HRInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/api/interviews');
      if (res.data.success) {
        const sorted = (res.data.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
        setInterviews(sorted);
      }
    } catch (error) {
      console.error('Failed to load interviews', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Scheduled Interviews</h1>
        <p className="text-gray-500 mt-1">Manage and track candidate interviews.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {interviews.length === 0 ? (
          <div className="p-8">
            <EmptyState message="No interviews are currently scheduled." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Job</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {interviews.map(interview => {
                  const dateObj = interview.date ? new Date(interview.date) : null;
                  const isPast = dateObj && dateObj < new Date(new Date().setHours(0,0,0,0));
                  
                  return (
                    <tr key={interview._id} className={`hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{interview.application?.candidate?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{interview.application?.candidate?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {interview.application?.job?.title || 'Job Deleted'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-900">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium">{dateObj ? dateObj.toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                          <Clock size={14} className="text-gray-400" />
                          {interview.time || 'TBD'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                        {interview.message || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {interview.application?._id && (
                          <Link 
                            to={`/hr/applications/${interview.application._id}`}
                            className="inline-flex items-center justify-center p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Application"
                          >
                            <Eye size={18} />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRInterviews;
