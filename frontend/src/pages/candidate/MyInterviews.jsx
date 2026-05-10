import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/interviews');
      if (res.data.success) {
        setInterviews(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch interviews', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
        <p className="text-gray-500 mt-1">View your scheduled interviews.</p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState message="You have no interviews scheduled at the moment." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map(interview => {
            const dateObj = interview.date ? new Date(interview.date) : null;
            const isUpcoming = dateObj && dateObj >= new Date(new Date().setHours(0,0,0,0));
            
            // interview.application may be populated with { candidate, job }
            const jobTitle = interview.application?.job?.title || 'Job Unavailable';
            const branchName = typeof interview.application?.job?.branch === 'object' 
              ? interview.application.job.branch.name 
              : 'N/A';
            
            return (
              <div 
                key={interview._id} 
                className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col h-full
                  ${isUpcoming ? 'border-primary-200' : 'border-gray-100 opacity-80'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  {dateObj && (
                    <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg font-bold text-lg text-center min-w-[70px]">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary-500">
                        {dateObj.toLocaleString('default', { month: 'short' })}
                      </div>
                      {dateObj.getDate()}
                    </div>
                  )}
                  
                  {isUpcoming ? (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Upcoming
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Past
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{jobTitle}</h3>
                
                <div className="space-y-3 flex-1 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-primary-500" />
                    <span className="font-medium">{interview.time || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-primary-500" />
                    <span>{branchName}</span>
                  </div>
                </div>
                
                {interview.message && (
                  <div className="mt-auto bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-2 text-gray-700 text-sm">
                      <MessageSquare size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{interview.message}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInterviews;
