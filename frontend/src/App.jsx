import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout & Protection
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Auth
import CareerPortal from './pages/public/CareerPortal';
import JobDetail from './pages/public/JobDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import CandidateApplications from './pages/candidate/MyApplications';
import CandidateInterviews from './pages/candidate/MyInterviews';

// HR
import HRDashboard from './pages/hr/Dashboard';
import HRJobs from './pages/hr/Jobs';
import CreateJob from './pages/hr/CreateJob';
import EditJob from './pages/hr/EditJob';
import HRApplications from './pages/hr/Applications';
import ApplicationDetail from './pages/hr/ApplicationDetail';
import HRInterviews from './pages/hr/Interviews';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminBranches from './pages/admin/Branches';

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<CareerPortal />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Routes */}
        <Route element={<ProtectedRoute allowedRoles={['candidate']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/applications" element={<CandidateApplications />} />
          <Route path="/candidate/interviews" element={<CandidateInterviews />} />
        </Route>

        {/* HR Routes (Admin can also access HR routes implicitly per prompt, but let's be explicit) */}
        <Route element={<ProtectedRoute allowedRoles={['hr', 'admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/jobs" element={<HRJobs />} />
          <Route path="/hr/jobs/create" element={<CreateJob />} />
          <Route path="/hr/jobs/edit/:id" element={<EditJob />} />
          <Route path="/hr/applications" element={<HRApplications />} />
          <Route path="/hr/applications/:id" element={<ApplicationDetail />} />
          <Route path="/hr/interviews" element={<HRInterviews />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/branches" element={<AdminBranches />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<CareerPortal />} />
      </Routes>
    </>
  );
}

export default App;
