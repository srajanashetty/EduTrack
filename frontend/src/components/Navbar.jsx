import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiUsers, FiCheckSquare, FiLogOut, FiTrendingUp, 
  FiFileText, FiBell, FiCalendar, FiBookOpen, FiSettings, 
  FiShield, FiUser, FiActivity, FiAlertTriangle
} from 'react-icons/fi';
import { updatesAPI } from '../services/api';
import { useState, useEffect } from 'react';

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = user?.role || 'STUDENT';
  const config = roleConfig[role.toUpperCase()] || roleConfig.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchUpdates = async () => {
    try {
      const res = await updatesAPI.getRecent(5);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch updates:', err);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'alert': return '#ef4444'; // Red
      case 'warning': return '#f59e0b'; // Yellow
      case 'info': return '#3b82f6'; // Blue
      default: return '#64748b';
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / 60000);
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/announcements', label: 'Notices', icon: <FiBell /> },
    { to: '/updates', label: 'Alerts', icon: <FiAlertTriangle /> },
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
              {notifications.length > 0 && (
                <span className="dot" style={{
                  position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                  background: 'var(--secondary)', borderRadius: '50%', border: '2px solid var(--primary)'
                }}></span>
              )}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Updates</span>
          </button>
          
          {showNotifications && (
            <div className="notify-dropdown" style={{
              position: 'absolute', left: '100%', bottom: 0, marginLeft: '10px',
              width: '300px', background: 'white', borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)', padding: '1.25rem', zIndex: 1000,
              color: 'var(--text-primary)', border: '1px solid var(--border-color)'
            }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Recent Notifications</h4>
              <div className="notify-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>No updates available</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="notify-item" style={{ fontSize: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ 
                          fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', 
                          color: 'white', background: getBadgeColor(n.type),
                          padding: '0.1rem 0.5rem', borderRadius: '4px'
                        }}>
                          {n.type}
                        </span>
                        <small style={{ color: 'var(--text-secondary)' }}>{getRelativeTime(n.createdAt)}</small>
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</p>
                    </div>
                  ))
                )}
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
