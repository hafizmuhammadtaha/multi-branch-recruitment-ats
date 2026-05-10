import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, ArrowRight, Building2 } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'HR', 'QA', 'DevOps', 'Management', 'Finance', 'Sales', 'Support'];

const CareerPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedBranch, selectedDepartment]);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/branches');
      if (res.data.success) {
        setBranches(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch branches', error);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = '/api/jobs?';
      if (searchQuery) url += `title=${encodeURIComponent(searchQuery)}&`;
      if (selectedBranch) url += `branch=${encodeURIComponent(selectedBranch)}&`;
      if (selectedDepartment) url += `department=${encodeURIComponent(selectedDepartment)}`;
      
      const res = await api.get(url);
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="text-primary-200 text-sm font-semibold uppercase tracking-widest mb-3">TechVista Solutions</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-10">
            Join our team of exceptional individuals and build the future together. Discover opportunities across all our branches.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-5xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search-jobs"
                className="block w-full pl-11 pr-3 py-4 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Job title or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="h-px md:h-auto md:w-px bg-gray-200 mx-2"></div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="filter-branch"
                className="block w-full pl-11 pr-10 py-4 border-none rounded-xl text-gray-900 bg-transparent focus:ring-0 sm:text-sm appearance-none"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch.name}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div className="h-px md:h-auto md:w-px bg-gray-200 mx-2"></div>

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="filter-department"
                className="block w-full pl-11 pr-10 py-4 border-none rounded-xl text-gray-900 bg-transparent focus:ring-0 sm:text-sm appearance-none"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            <p className="text-gray-500 mt-2">Showing {jobs.length} available jobs</p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : jobs.length === 0 ? (
          <EmptyState message="No jobs found matching your criteria. Try adjusting your search filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary-50 text-primary-700 p-3 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <Briefcase size={24} />
                  </div>
                  {job.availableSeats > 0 ? (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {job.availableSeats} Seats
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Closed
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{job.title}</h3>
                
                <div className="flex items-center text-gray-500 mb-4 text-sm gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.branch?.name || 'Remote'}</span>
                  </div>
                  {job.department && (
                    <div className="flex items-center gap-1">
                      <Building2 size={16} />
                      <span>{job.department}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">
                  {job.description}
                </p>
                
                <Link 
                  to={`/jobs/${job._id}`}
                  className="inline-flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-colors"
                >
                  View Details
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TechVista Solutions. All rights reserved.</p>
          <p className="mt-1">Multi-Branch Recruitment & Applicant Tracking System</p>
        </div>
      </footer>
    </div>
  );
};

export default CareerPortal;
