import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import AttendanceManagement from './components/AttendanceManagement';
import MarksUpload from './components/MarksUpload';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Reports from './components/Reports';
import Announcements from './components/Announcements';
import TimetableManagement from './components/TimetableManagement';
import ExamManagement from './components/ExamManagement';
import ProfilePage from './components/ProfilePage';
import { useAuth } from './context/AuthContext';

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>
      <Navbar />
      <div className="main-content">{children}</div>
    </>
  ) : (
    children
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <AppLayout>
      <Routes>
        {/* Public */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

        {/* All authenticated users */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute><TimetableManagement /></PrivateRoute>} />
        <Route path="/exams" element={<PrivateRoute><ExamManagement /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><AttendanceManagement /></PrivateRoute>} />
        <Route path="/marks" element={<PrivateRoute><MarksUpload /></PrivateRoute>} />

        {/* Admin / Teacher only */}
        <Route path="/students" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><StudentManagement /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><AnalyticsDashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><Reports /></PrivateRoute>} />

        {/* Catch-all and Root */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
