import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiCheckSquare, FiFileText,
  FiBarChart2, FiClipboard, FiBell, FiLogOut,
  FiShield, FiBook, FiUser, FiCalendar
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
  const config = roleConfig[role.toUpperCase()] || roleConfig.STUDENT;

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
      { path: '/profile', label: 'Profile Settings', icon: <FiUser /> },
      { path: '/announcements', label: 'Announcements', icon: <FiBell /> },
    );
  } else {
    navItems.push(
      { path: '/timetable', label: 'My Timetable', icon: <FiCalendar /> },
      { path: '/exams', label: 'My Exams', icon: <FiCalendar /> },
      { path: '/attendance', label: 'My Attendance', icon: <FiCheckSquare /> },
      { path: '/marks', label: 'My Marks', icon: <FiFileText /> },
      { path: '/profile', label: 'My Profile', icon: <FiUser /> },
      { path: '/announcements', label: 'Announcements', icon: <FiBell /> },
    );
  }

  // Get initials for avatar
  const initials = (user?.username || '?').slice(0, 2).toUpperCase();

  return (
    <nav className="wdu-sidebar">
      <div className="sidebar-top">
        <NavLink to="/dashboard" className="brand">
          <div className="brand-icon" style={{
            width: '32px', height: '32px', background: 'var(--primary)',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 800
          }}>E</div>
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

      <div className="sidebar-bottom">
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          margin: '0 0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${config.color}, ${config.color}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800, color: '#fff',
              boxShadow: `0 4px 12px ${config.color}33`,
            }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {user?.username}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: config.bg, color: config.color,
                padding: '0.1rem 0.6rem', borderRadius: '6px',
                fontSize: '0.7rem', fontWeight: 700, marginTop: '0.2rem'
              }}>
                {config.avatar} {config.label}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.08)', color: '#ef4444',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <FiLogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
