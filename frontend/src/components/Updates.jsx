import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatesAPI } from '../services/api';
import { FiAlertTriangle, FiPlusCircle, FiTrash2, FiInfo, FiAlertCircle } from 'react-icons/fi';

const typeConfig = {
  alert: { label: 'System Alert', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <FiAlertCircle /> },
  warning: { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <FiAlertTriangle /> },
  info: { label: 'Info', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <FiInfo /> },
};

const Updates = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchUpdates = async () => {
    try {
      const res = await updatesAPI.getAll();
      setUpdates(res.data);
    } catch {
      showMsg('error', 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 15000);
    return () => clearInterval(interval);
  }, []);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updatesAPI.create(form);
      setForm({ title: '', message: '', type: 'info' });
      setShowForm(false);
      showMsg('success', 'Update posted successfully!');
      fetchUpdates();
    } catch {
      showMsg('error', 'Failed to post update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this update?')) return;
    try {
      await updatesAPI.delete(id);
      showMsg('success', 'Update deleted');
      fetchUpdates();
    } catch {
      showMsg('error', 'Failed to delete');
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><FiAlertTriangle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> System Updates</h1>
          <p>{isAdmin ? 'Post system-wide alerts and warnings' : 'Latest system notifications and alerts'}</p>
        </div>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
            style={{ width: 'auto', padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiPlusCircle /> {showForm ? 'Cancel' : 'Post New Update'}
          </button>
        )}
      </div>

      {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

      {showForm && isAdmin && (
        <div className="wdu-card" style={{ marginBottom: '1.5rem', border: '2px solid var(--primary)' }}>
          <div className="card-header">
            <h3>📢 Create Update</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '1rem 0' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="Update title (e.g., Results Published)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input"
                placeholder="Detail of the update..."
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="alert">🔴 Alert (Red)</option>
                <option value="warning">🟡 Warning (Yellow)</option>
                <option value="info">🔵 Info (Blue)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-success" disabled={submitting} style={{ width: 'auto', padding: '0.7rem 2rem' }}>
                {submitting ? 'Posting...' : 'Post Update'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-container"><div className="spinner"></div></div>
      ) : updates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No Updates Available</h3>
          <p>Everything is running smoothly.</p>
        </div>
      ) : (
        <div className="wdu-table-container">
          <table className="wdu-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Update</th>
                <th>Time</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {updates.map(upd => (
                <tr key={upd.id}>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                      background: typeConfig[upd.type]?.bg || '#f3f4f6',
                      color: typeConfig[upd.type]?.color || '#374151',
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                      {typeConfig[upd.type]?.icon} {upd.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{upd.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{upd.message}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{getTimeAgo(upd.createdAt)}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn-icon delete" onClick={() => handleDelete(upd.id)}><FiTrash2 /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Updates;
