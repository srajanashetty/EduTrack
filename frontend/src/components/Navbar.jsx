import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiUsers, FiCheckSquare, FiLogOut, FiTrendingUp, 
  FiFileText, FiBell, FiCalendar, FiBookOpen, FiSettings, 
  FiShield, FiUser, FiActivity 
} from 'react-icons/fi';
import { useState } from 'react';

const roleConfig = {
  ADMIN: {
    label: 'Administrator',
    icon: <FiShield size={12} />,
    color: '#3d8b40',
    bg: 'rgba(61, 139, 64, 0.15)',
    avatar: '🏛️',
  },
  TEACHER: {
    label: 'Faculty',
    icon: <FiBookOpen size={12} />,
    color: '#3d8b40',
    bg: 'rgba(61, 139, 64, 0.15)',
    avatar: '📖',
  },
  STUDENT: {
    label: 'Scholar',
    icon: <FiUser size={12} />,
    color: '#3d8b40',
    bg: 'rgba(61, 139, 64, 0.15)',
    avatar: '🎓',
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const role = user?.role || 'STUDENT';
  const config = roleConfig[role.toUpperCase()] || roleConfig.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: '3 students at risk (Low Attendance)', time: '2 mins ago', type: 'warning' },
    { id: 2, text: 'Mid-term results published', time: '1 hour ago', type: 'info' },
    { id: 3, text: 'New announcement from Dean', time: '3 hours ago', type: 'success' },
  ];

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/announcements', label: 'Notices', icon: <FiBell /> },
    { to: '/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
    { to: '/marks', label: 'Performance', icon: <FiTrendingUp /> },
    { to: '/timetable', label: 'Class Schedule', icon: <FiCalendar /> },
    { to: '/exams', label: 'Examination', icon: <FiBookOpen /> },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'TEACHER') {
    navItems.splice(1, 0, { to: '/students', label: 'Directory', icon: <FiUsers /> });
    navItems.push({ to: '/analytics', label: 'Insights', icon: <FiActivity /> });
    navItems.push({ to: '/reports', label: 'Exports', icon: <FiFileText /> });
    navItems.push({ to: '/profile', label: 'Settings', icon: <FiSettings /> });
  } else {
    navItems.push({ to: '/profile', label: 'My Profile', icon: <FiUser /> });
  }

  const displayName = user?.username?.split('@')[0] || user?.username || 'User';
  const initials = (user?.username || '?').slice(0, 2).toUpperCase();

  return (
    <nav className="wdu-sidebar">
      <div className="sidebar-top">
        <NavLink to="/dashboard" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div className="brand-icon" style={{
            width: '40px', height: '40px', background: 'var(--secondary)',
            borderRadius: '4px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 900,
            fontSize: '1.4rem'
          }}>E</div>
          <span className="brand-text" style={{ 
            color: '#fff', 
            fontSize: '1.5rem', 
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.02em'
          }}>EduTrack</span>
        </NavLink>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-bottom">
        <div className="user-profile-mini">
          <div className="user-avatar" style={{ background: config.bg, color: config.color }}>
            {initials}
          </div>
          <div className="user-info">
            <span className="name">{user?.username}</span>
            <span className="role-tag" style={{ color: config.color }}>
              {config.icon} {config.label}
            </span>
          </div>
        </div>

        <div className="notification-bell-container" style={{ position: 'relative', marginTop: '1rem' }}>
          <button 
            className="notify-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', 
              gap: '1rem', padding: '0.8rem 1.25rem', background: 'rgba(255,255,255,0.05)',
              border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <FiBell />
              <span className="dot" style={{
                position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                background: 'var(--secondary)', borderRadius: '50%', border: '2px solid var(--primary)'
              }}></span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Updates</span>
          </button>
          
          {showNotifications && (
            <div className="notify-dropdown" style={{
              position: 'absolute', left: '100%', bottom: 0, marginLeft: '10px',
              width: '280px', background: 'white', borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)', padding: '1.25rem', zIndex: 1000,
              color: 'var(--text-primary)', border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Recent Notifications</h4>
              <div className="notify-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(n => (
                  <div key={n.id} className="notify-item" style={{ fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{n.text}</p>
                    <small style={{ color: 'var(--text-secondary)' }}>{n.time}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="logout-btn" 
          onClick={handleLogout} 
          style={{ 
            marginTop: '0.75rem', width: '100%', display: 'flex', 
            alignItems: 'center', gap: '1rem', padding: '0.8rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem'
          }}
        >
          <FiLogOut />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
