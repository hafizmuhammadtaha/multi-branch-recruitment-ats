import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// public pages
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetail from './pages/public/JobDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import Profile from './pages/candidate/Profile';
import MyApplications from './pages/candidate/MyApplications';
import AppDetail from './pages/candidate/ApplicationDetail';
import MyInterviews from './pages/candidate/MyInterviews';

// hr pages
import HRDashboard from './pages/hr/Dashboard';
import ManageJobs from './pages/hr/ManageJobs';
import CreateJob from './pages/hr/CreateJob';
import EditJob from './pages/hr/EditJob';
import HRApplications from './pages/hr/Applications';
import HRAppDetail from './pages/hr/ApplicationDetail';
import HRInterviews from './pages/hr/Interviews';

// admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Branches from './pages/admin/Branches';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* candidate */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roles={['candidate', 'hr', 'admin']}><Profile /></ProtectedRoute>} />
        <Route path="/my-applications" element={<ProtectedRoute roles={['candidate']}><MyApplications /></ProtectedRoute>} />
        <Route path="/my-applications/:id" element={<ProtectedRoute roles={['candidate']}><AppDetail /></ProtectedRoute>} />
        <Route path="/my-interviews" element={<ProtectedRoute roles={['candidate']}><MyInterviews /></ProtectedRoute>} />

        {/* hr */}
        <Route path="/hr/dashboard" element={<ProtectedRoute roles={['hr', 'admin']}><HRDashboard /></ProtectedRoute>} />
        <Route path="/hr/jobs" element={<ProtectedRoute roles={['hr', 'admin']}><ManageJobs /></ProtectedRoute>} />
        <Route path="/hr/jobs/create" element={<ProtectedRoute roles={['hr', 'admin']}><CreateJob /></ProtectedRoute>} />
        <Route path="/hr/jobs/:id/edit" element={<ProtectedRoute roles={['hr', 'admin']}><EditJob /></ProtectedRoute>} />
        <Route path="/hr/applications" element={<ProtectedRoute roles={['hr', 'admin']}><HRApplications /></ProtectedRoute>} />
        <Route path="/hr/applications/:id" element={<ProtectedRoute roles={['hr', 'admin']}><HRAppDetail /></ProtectedRoute>} />
        <Route path="/hr/interviews" element={<ProtectedRoute roles={['hr', 'admin']}><HRInterviews /></ProtectedRoute>} />

        {/* admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/branches" element={<ProtectedRoute roles={['admin']}><Branches /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;