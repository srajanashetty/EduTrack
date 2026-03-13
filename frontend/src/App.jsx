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
  const { isAuthenticated } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><StudentManagement /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><AttendanceManagement /></PrivateRoute>} />
        <Route path="/marks" element={<PrivateRoute><MarksUpload /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><AnalyticsDashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute roles={['ADMIN', 'TEACHER']}><Reports /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
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
