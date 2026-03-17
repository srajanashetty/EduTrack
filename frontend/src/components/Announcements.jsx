import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementsAPI } from '../services/api';
import { FiBell, FiPlusCircle, FiTrash2, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const priorityConfig = {
  HIGH: { label: 'Urgent', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <FiAlertCircle /> },
  MEDIUM: { label: 'Important', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <FiAlertTriangle /> },
  LOW: { label: 'Info', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: <FiInfo /> },
};

const roleColors = {
  ADMIN: { bg: 'rgba(99,102,241,0.15)', color: '#6366f1', label: 'Admin' },
  TEACHER: { bg: 'rgba(6,182,212,0.15)', color: '#06b6d4', label: 'Teacher' },
};

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Announcements = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'TEACHER';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'MEDIUM' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await announcementsAPI.getAll();
      setAnnouncements(res.data);
    } catch {
      showMsg('error', 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    // Poll every 30 seconds for near-real-time updates
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, [fetchAnnouncements]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await announcementsAPI.create(form);
      setForm({ title: '', content: '', priority: 'MEDIUM' });
      setShowForm(false);
      showMsg('success', 'Announcement posted successfully!');
      fetchAnnouncements();
    } catch {
      showMsg('error', 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementsAPI.delete(id);
      showMsg('success', 'Announcement deleted');
      fetchAnnouncements();
    } catch {
      showMsg('error', 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><FiBell style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Announcements</h1>
          <p>{isStaff ? 'Post and manage college announcements' : 'Stay updated with the latest news from your institution'}</p>
        </div>
        {isStaff && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ width: 'auto', padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiPlusCircle /> {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        )}
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      {/* Post Form */}
      {showForm && isStaff && (
        <div className="wdu-card" style={{ marginBottom: '1.5rem', border: '2px solid var(--primary)' }}>
          <div className="card-header">
            <h3>✏️ Create Announcement</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '1rem 0' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Announcement title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input"
                placeholder="Write your announcement here..."
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="HIGH">🔴 Urgent</option>
                <option value="MEDIUM">🟡 Important</option>
                <option value="LOW">🔵 Info</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-success" disabled={submitting} style={{ width: 'auto', padding: '0.7rem 2rem' }}>
                {submitting ? 'Posting...' : '📢 Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <h3>No Announcements Yet</h3>
          <p>{isStaff ? 'Click "New Announcement" to post the first one' : 'No announcements have been posted yet'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {announcements.map((ann) => {
            const priority = priorityConfig[ann.priority] || priorityConfig.LOW;
            const roleStyle = roleColors[ann.postedByRole] || roleColors.TEACHER;
            return (
              <div
                key={ann.id}
                className="wdu-card"
                style={{
                  borderLeft: `4px solid ${priority.color}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: 'fadeInUp 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem 0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    {/* Priority badge + title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        background: priority.bg, color: priority.color,
                        padding: '0.2rem 0.7rem', borderRadius: '999px',
                        fontSize: '0.75rem', fontWeight: 700
                      }}>
                        {priority.icon} {priority.label}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>{ann.title}</h3>
                    </div>

                    {/* Content */}
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.9rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
                      {ann.content}
                    </p>

                    {/* Footer: Posted by + time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: roleStyle.bg, color: roleStyle.color,
                        padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {ann.postedByRole === 'ADMIN' ? '👑' : '📚'} {ann.postedBy}
                        <span style={{ opacity: 0.7 }}>· {ann.postedByRole}</span>
                      </div>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                        🕒 {timeAgo(ann.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Delete button for staff */}
                  {isStaff && (
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(ann.id)}
                      title="Delete announcement"
                      style={{ flexShrink: 0, marginTop: '0.2rem' }}
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Announcements;
