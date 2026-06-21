import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Jobs from './pages/Jobs';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CandidateDashboard from "./pages/dashboard/CandidateDashboard";
import EmployerDashboard from "./pages/dashboard/EmployerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails'
import ChatBot from './components/chatbot/ChatBot'
import Messenger from "./pages/messages/Messenger";
import ApplicantsPage from "./pages/dashboard/ApplicantsPage";
import ApplyJob from "./pages/ApplyJob";
import EmployerApplications from "./pages/EmployerApplications";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminJobs from "./pages/dashboard/AdminJobs";
const App = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "1rem 2rem" }}>
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/post-job"
    element={
      <ProtectedRoute allowedRoles={["employer"]}>
        <PostJob />
      </ProtectedRoute>
    }
  />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/dashboard/candidate"
    element={
      <ProtectedRoute allowedRoles={["candidate"]}>
        <CandidateDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/dashboard/employer"
    element={
      <ProtectedRoute allowedRoles={["employer"]}>
        <EmployerDashboard />
      </ProtectedRoute>
    }
  />

 <Route
  path="/dashboard/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

  <Route
    path="/profile"
    element={
      <ProtectedRoute allowedRoles={["candidate", "employer", "admin"]}>
        <Profile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/messages"
    element={
      <ProtectedRoute allowedRoles={["candidate", "employer", "admin"]}>
        <Messenger />
      </ProtectedRoute>
    }
  />

  <Route
    path="/dashboard/applicants/:jobId"
    element={
      <ProtectedRoute allowedRoles={["employer"]}>
        <ApplicantsPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/apply/:id"
    element={
      <ProtectedRoute allowedRoles={["candidate"]}>
        <ApplyJob />
      </ProtectedRoute>
    }
  />

  <Route
    path="/employer/applications/:jobId"
    element={
      <ProtectedRoute allowedRoles={["employer"]}>
        <EmployerApplications />
      </ProtectedRoute>
    }
  />
  <Route
  path="/dashboard/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/admin/jobs"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminJobs />
    </ProtectedRoute>
  }
/>
</Routes>
      </main>
      <ChatBot />
      <ToastContainer position='top-right' />
    </div>
  );
}

export default App;