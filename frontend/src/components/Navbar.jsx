import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiCheckSquare, FiFileText, FiBarChart2, FiClipboard } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [];

  if (user?.role === 'ADMIN' || user?.role === 'TEACHER') {
    navItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/students', label: 'Students', icon: <FiUsers /> },
      { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
      { path: '/marks', label: 'Marks', icon: <FiFileText /> },
      { path: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
      { path: '/reports', label: 'Reports', icon: <FiClipboard /> }
    );
  } else if (user?.role === 'STUDENT') {
    navItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/attendance', label: 'My Attendance', icon: <FiCheckSquare /> },
      { path: '/marks', label: 'My Marks', icon: <FiFileText /> }
    );
  }

  return (
    <nav className="wdu-sidebar">
      <div className="sidebar-top">
        <NavLink to="/dashboard" className="brand">
          <div className="brand-icon">E</div>
          <span className="brand-text">EduTrack</span>
        </NavLink>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-bottom user-section">
        <div className="user-info">
          <span className="user-name">{user?.username}</span>
          <br/>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
