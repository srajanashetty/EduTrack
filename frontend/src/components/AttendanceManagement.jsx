import { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCheckSquare, FiCalendar } from 'react-icons/fi';

const AttendanceManagement = () => {
  const { user, isAdminOrTeacher, isStudent } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewMode, setViewMode] = useState(isAdminOrTeacher() ? 'mark' : 'view');

  // View-records state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [studentStats, setStudentStats] = useState(null);

  useEffect(() => {
    if (isAdminOrTeacher()) {
      fetchStudents();
    } else if (isStudent()) {
      const sid = user?.studentId;
      if (sid) {
        setSelectedStudentId(String(sid));
        loadStudentAttendance(sid);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data);
      const map = {};
      res.data.forEach((s) => { map[s.id] = 'PRESENT'; });
      setAttendanceMap(map);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentAttendance = async (id) => {
    try {
      const [recordsRes, statsRes] = await Promise.all([
        attendanceAPI.getByStudent(id),
        attendanceAPI.getStudentStats(id),
      ]);
      setStudentAttendance(recordsRes.data);
      setStudentStats(statsRes.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const toggleAttendance = (studentId) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT',
    }));
  };

  const handleMarkAll = (status) => {
    const newMap = {};
    students.forEach((s) => { newMap[s.id] = status; });
    setAttendanceMap(newMap);
  };

  const handleSubmitAttendance = async () => {
    try {
      const requests = Object.entries(attendanceMap).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        date: selectedDate,
        status,
      }));
      await attendanceAPI.markBulk(requests);
      showMessage('success', `Attendance marked for ${requests.length} students`);
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to mark attendance');
    }
  };

  const handleViewStudentAttendance = async () => {
    if (!selectedStudentId) return;
    await loadStudentAttendance(selectedStudentId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  /* ===================== STUDENT VIEW ===================== */
  if (isStudent()) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>My Attendance</h1>
            <p>View your attendance records and statistics</p>
          </div>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        {studentStats && (
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon primary"><FiCalendar /></div>
              <div className="stat-info">
                <h4>{studentStats.totalDays}</h4>
                <p>Total Days</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success"><FiCheckSquare /></div>
              <div className="stat-info">
                <h4>{studentStats.presentDays}</h4>
                <p>Present Days</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">✘</div>
              <div className="stat-info">
                <h4>{studentStats.absentDays}</h4>
                <p>Absent Days</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon accent">%</div>
              <div className="stat-info">
                <h4>{studentStats.attendancePercentage}%</h4>
                <p>Attendance</p>
              </div>
            </div>
          </div>
        )}

        <div className="wdu-card">
          <div className="card-header">
            <h3><FiCheckSquare style={{ marginRight: '0.5rem' }} /> Attendance Records</h3>
          </div>
          {studentAttendance.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr><th>#</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {studentAttendance.map((record, idx) => (
                    <tr key={record.id}>
                      <td>{idx + 1}</td>
                      <td>{record.date}</td>
                      <td><span className={`badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Records Yet</h3>
              <p>Your attendance hasn't been recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ===================== ADMIN / TEACHER VIEW ===================== */
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Mark and view student attendance records</p>
        </div>
        <div className="tab-switcher" style={{ maxWidth: '280px', marginBottom: 0 }}>
          <button className={`tab-btn ${viewMode === 'mark' ? 'active' : ''}`} onClick={() => setViewMode('mark')}>Mark Attendance</button>
          <button className={`tab-btn ${viewMode === 'view' ? 'active' : ''}`} onClick={() => setViewMode('view')}>View Records</button>
        </div>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      {viewMode === 'mark' ? (
        /* MARK ATTENDANCE — ADMIN only can submit; TEACHER sees read-only */
        <div className="wdu-card">
          <div className="card-header">
            <h3><FiCalendar style={{ marginRight: '0.5rem' }} /> Mark Attendance</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input type="date" className="form-input" style={{ width: 'auto' }} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                <>
                  <button className="btn-success" onClick={() => handleMarkAll('PRESENT')} style={{ fontSize: '0.8rem' }}>All Present</button>
                  <button className="btn-danger" onClick={() => handleMarkAll('ABSENT')} style={{ fontSize: '0.8rem' }}>All Absent</button>
                </>
              )}
            </div>
          </div>

          {students.length > 0 ? (
            <>
              <div className="wdu-table-container">
                <table className="wdu-table">
                  <thead>
                    <tr><th>#</th><th>Student Name</th><th>Department</th><th>Year</th><th>Section</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={student.id}>
                        <td>{idx + 1}</td>
                        <td><strong>{student.name}</strong></td>
                        <td>{student.department}</td>
                        <td>{student.year}</td>
                        <td>{student.section}</td>
                        <td>
                          <button
                            className={`badge ${attendanceMap[student.id] === 'PRESENT' ? 'present' : 'absent'}`}
                            onClick={() => toggleAttendance(student.id)}
                            style={{
                              cursor: 'pointer',
                              border: 'none', padding: '0.4rem 1rem', fontSize: '0.8rem',
                              transition: 'all 0.2s ease'
                            }}
                            title="Click to toggle Present / Absent"
                          >
                            {attendanceMap[student.id] === 'PRESENT' ? '✅ PRESENT' : '❌ ABSENT'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Bulk Actions:</span>
                    <button className="btn-secondary" onClick={() => handleMarkAll('PRESENT')} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Mark All Present</button>
                    <button className="btn-secondary" onClick={() => handleMarkAll('ABSENT')} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Clear All</button>
                  </div>
                  <button className="btn-primary" onClick={handleSubmitAttendance} style={{ width: 'auto', padding: '0.8rem 2.5rem' }}>
                    <FiCheckSquare style={{ marginRight: '0.5rem' }} /> Confirm & Submit
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Students Found</h3>
              <p>Add students first to mark attendance</p>
            </div>
          )}
        </div>
      ) : (
        /* VIEW RECORDS */
        <div className="wdu-card">
          <div className="card-header">
            <h3><FiCheckSquare style={{ marginRight: '0.5rem' }} /> Student Attendance Records</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select className="form-select" style={{ width: 'auto', minWidth: '200px' }} value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                <option value="">Select Student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="btn-primary" onClick={handleViewStudentAttendance} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>View</button>
            </div>
          </div>

          {studentStats && (
            <div className="stats-grid" style={{ marginTop: '1rem' }}>
              <div className="stat-card">
                <div className="stat-icon primary"><FiCalendar /></div>
                <div className="stat-info"><h4>{studentStats.totalDays}</h4><p>Total Days</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon success"><FiCheckSquare /></div>
                <div className="stat-info"><h4>{studentStats.presentDays}</h4><p>Present Days</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon danger">✘</div>
                <div className="stat-info"><h4>{studentStats.absentDays}</h4><p>Absent Days</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accent">%</div>
                <div className="stat-info"><h4>{studentStats.attendancePercentage}%</h4><p>Attendance</p></div>
              </div>
            </div>
          )}

          {studentAttendance.length > 0 ? (
            <div className="wdu-table-container" style={{ marginTop: '1rem' }}>
              <table className="wdu-table">
                <thead>
                  <tr><th>#</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {studentAttendance.map((record, idx) => (
                    <tr key={record.id}>
                      <td>{idx + 1}</td>
                      <td>{record.date}</td>
                      <td><span className={`badge ${record.status.toLowerCase()}`}>{record.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedStudentId ? (
            <div className="empty-state"><p>No attendance records found for this student</p></div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
