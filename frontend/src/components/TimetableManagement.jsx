import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { timetableAPI, studentAPI } from '../services/api';
import { FiPlus, FiClock, FiMapPin, FiTrash2, FiCalendar, FiUser } from 'react-icons/fi';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const TimetableManagement = () => {
  const { user, isAdminOrTeacher, isStudent } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [filters, setFilters] = useState({ department: '', year: '', section: '' });
  const [form, setForm] = useState({
    day: 'MONDAY', subject: '', startTime: '', endTime: '', teacherName: '',
    room: '', department: '', year: '', section: '',
  });

  const fetchTimetable = useCallback(async (f) => {
    setLoading(true);
    try {
      if (f.department && f.year && f.section) {
        const res = await timetableAPI.getByClass(f);
        setTimetable(res.data);
      } else if (isAdminOrTeacher()) {
        const res = await timetableAPI.getAll();
        setTimetable(res.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdminOrTeacher]);

  useEffect(() => {
    const init = async () => {
      if (isStudent() && user?.studentId) {
        try {
          const res = await studentAPI.getById(user.studentId);
          const p = res.data;
          setProfile(p);
          const f = { department: p.department, year: p.year, section: p.section };
          setFilters(f);
          fetchTimetable(f);
        } catch (err) { console.error(err); setLoading(false); }
      } else {
        fetchTimetable(filters);
      }
    };
    init();
  }, [user, isStudent, fetchTimetable, filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await timetableAPI.create({ ...form, year: parseInt(form.year) });
      setShowModal(false);
      setForm({ ...form, subject: '', startTime: '', endTime: '', room: '' });
      fetchTimetable(filters);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete entry?')) return;
    try {
      await timetableAPI.delete(id);
      fetchTimetable(filters);
    } catch (err) { console.error(err); }
  };

  const groupTimetable = () => {
    const grouped = {};
    daysOfWeek.forEach(d => grouped[d] = []);
    timetable.forEach(entry => {
      if (grouped[entry.day]) grouped[entry.day].push(entry);
    });
    // Sort by startTime
    Object.keys(grouped).forEach(d => {
      grouped[d].sort((a,b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  };

  const grouped = groupTimetable();

  if (loading && !timetable.length) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Schedule...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1><FiCalendar style={{ marginRight: '0.5rem' }} /> Academic Timetable</h1>
          <p>{isStudent() ? `Class: ${profile?.department} - Year ${profile?.year} - ${profile?.section}` : 'Manage institution schedule'}</p>
        </div>
        {isAdminOrTeacher() && (
          <button className="btn-primary" onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPlus /> Add Class
          </button>
        )}
      </div>

      {!isStudent() && (
        <div className="wdu-card mb-3" style={{ padding: '1rem' }}>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select className="form-select" style={{ width: '200px' }} value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
              <option value="">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
            </select>
            <button className="btn-secondary" onClick={() => fetchTimetable(filters)}>Filter Result</button>
           </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {daysOfWeek.map(day => (
          <div key={day} className="wdu-card">
            <div className="card-header" style={{ background: 'var(--primary-glow)', borderBottom: '2px solid var(--primary)' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>{day}</h3>
            </div>
            <div style={{ padding: '1rem' }}>
              {grouped[day].length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', margin: '1rem 0' }}>No classes scheduled</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {grouped[day].map(entry => (
                    <div key={entry.id} style={{
                      padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px',
                      borderLeft: '4px solid var(--primary)', position: 'relative'
                    }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{entry.subject}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiClock /> {entry.startTime} - {entry.endTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiUser /> Prof. {entry.teacherName}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FiMapPin /> Room: {entry.room}
                        </span>
                      </div>
                      {isAdminOrTeacher() && (
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(entry.id)}
                          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.4rem' }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
         <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <h2>Schedule New Class</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <div className="form-group">
                        <label>Subject</label>
                        <input className="form-input" type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input className="form-input" type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>End Time</label>
                            <input className="form-input" type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Day</label>
                          <select className="form-select" value={form.day} onChange={e => setForm({...form, day: e.target.value})} required>
                              {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                            <label>Room No</label>
                            <input className="form-input" type="text" value={form.room} onChange={e => setForm({...form, room: e.target.value})} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Teacher Name</label>
                        <input className="form-input" type="text" value={form.teacherName} onChange={e => setForm({...form, teacherName: e.target.value})} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div className="form-group"><label>Dept</label><input className="form-input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required /></div>
                        <div className="form-group"><label>Year</label><input className="form-input" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required /></div>
                        <div className="form-group"><label>Sec</label><input className="form-input" value={form.section} onChange={e => setForm({...form, section: e.target.value})} required /></div>
                    </div>
                    <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-success">Save Entry</button>
                    </div>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default TimetableManagement;
