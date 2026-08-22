import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Curriculum } from './pages/Curriculum';
import { CurriculumDetail } from './pages/CurriculumDetail';
import { Branch } from './pages/Branch';
import { LabManuals } from './pages/LabManuals';
import { MaterialsHub } from './pages/MaterialsHub';
import { MicroProjects } from './pages/MicroProjects';
import { QuestionPapers } from './pages/QuestionPapers';
import { Notes } from './pages/Notes';
import { ManualAnswers } from './pages/ManualAnswers';
import { MsbteImp } from './pages/MsbteImp';
import { LectureVideos } from './pages/LectureVideos';
import { Updates } from './pages/Updates';
import { Assignments } from './pages/Assignments';
import { MyReports } from './pages/MyReports';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyOTP } from './pages/VerifyOTP';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { CompleteProfile } from './pages/CompleteProfile';
import { EmailVerified } from './pages/EmailVerified';
import { About } from './pages/About';
import { Feedback } from './pages/Feedback';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  useEffect(() => {
    const handleForceLogin = () => navigate('/login');
    window.addEventListener('force-login', handleForceLogin);
    return () => window.removeEventListener('force-login', handleForceLogin);
  }, [navigate]);
  return null;
}

const MainLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
        {/* Main Application Routes (with Navbar & Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
          <Route path="/branch/:branchId" element={<Branch />} />
          <Route path="/materials" element={<MaterialsHub />} />
          <Route path="/lab-manuals" element={<LabManuals />} />
          <Route path="/microprojects" element={<MicroProjects />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/manual-answers" element={<ManualAnswers />} />
          <Route path="/msbte-imp" element={<MsbteImp />} />
          <Route path="/lecture-videos" element={<LectureVideos />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Authentication Routes (Standalone Full-Screen Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/auth/verified" element={<EmailVerified />} />

        {/* Secure Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </HelmetProvider>
  );
}

export default App;

