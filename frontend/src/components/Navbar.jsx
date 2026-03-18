import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiCheckSquare, FiFileText,
  FiBarChart2, FiClipboard, FiBell, FiLogOut,
  FiShield, FiBook, FiUser
} from 'react-icons/fi';

const roleConfig = {
  ADMIN: {
    label: 'Administrator',
    icon: <FiShield size={12} />,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.15)',
    avatar: '👑',
  },
  TEACHER: {
    label: 'Teacher',
    icon: <FiBook size={12} />,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.15)',
    avatar: '📚',
  },
  STUDENT: {
    label: 'Student',
    icon: <FiUser size={12} />,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    avatar: '🎓',
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'STUDENT';
  const config = roleConfig[role] || roleConfig.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [];

  if (role === 'ADMIN' || role === 'TEACHER') {
    navItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/students', label: 'Students', icon: <FiUsers /> },
      { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
      { path: '/marks', label: 'Marks', icon: <FiFileText /> },
      { path: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
      { path: '/reports', label: 'Reports', icon: <FiClipboard /> },
      { path: '/timetable', label: 'Timetable', icon: <FiCalendar /> },
      { path: '/exams', label: 'Exams', icon: <FiCalendar /> },
      { path: '/announcements', label: 'Announcements', icon: <FiBell /> },
    );
  } else {
    navItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
      { path: '/timetable', label: 'My Timetable', icon: <FiCalendar /> },
      { path: '/exams', label: 'My Exams', icon: <FiCalendar /> },
      { path: '/attendance', label: 'My Attendance', icon: <FiCheckSquare /> },
      { path: '/marks', label: 'My Marks', icon: <FiFileText /> },
      { path: '/announcements', label: 'Announcements', icon: <FiBell /> },
    );
  }

  // Get initials for avatar
  const initials = (user?.username || '?').slice(0, 2).toUpperCase();

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

      {/* Improved User Section */}
      <div className="sidebar-bottom" style={{ padding: '1rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '0.9rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          {/* User Identity Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Avatar circle */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${config.color}, ${config.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              boxShadow: `0 0 0 2px ${config.color}44`,
            }}>
              {initials}
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: 'var(--text-primary)', fontWeight: 700,
                fontSize: '0.88rem', whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.username}
              </div>
              {/* Role badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: config.bg, color: config.color,
                padding: '0.15rem 0.5rem', borderRadius: '999px',
                fontSize: '0.7rem', fontWeight: 700, marginTop: '0.2rem',
              }}>
                {config.avatar} {config.label}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: 'rgba(239,68,68,0.12)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px',
              padding: '0.55rem', cursor: 'pointer', fontSize: '0.83rem',
              fontWeight: 600, transition: 'all 0.2s ease', width: '100%',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
