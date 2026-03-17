import { useState, useEffect } from 'react';
import { studentAPI, marksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiFileText, FiPlus } from 'react-icons/fi';

const MarksUpload = () => {
  const { user, isAdminOrTeacher, isStudent } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewMode, setViewMode] = useState(isAdminOrTeacher() ? 'upload' : 'view');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentMarks, setStudentMarks] = useState([]);
  const [form, setForm] = useState({ studentId: '', subject: '', marks: '' });
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkMarks, setBulkMarks] = useState({});

  useEffect(() => {
    if (isAdminOrTeacher()) {
      fetchStudents();
    } else if (isStudent()) {
      // Student: auto-load their own marks using stored studentId
      const sid = user?.studentId;
      if (sid) {
        setSelectedStudentId(String(sid));
        fetchStudentMarks(sid);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentMarks = async (id) => {
    try {
      const res = await marksAPI.getByStudent(id);
      setStudentMarks(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    try {
      await marksAPI.add({
        studentId: parseInt(form.studentId),
        subject: form.subject,
        marks: parseFloat(form.marks),
      });
      showMessage('success', 'Marks added successfully');
      setForm({ studentId: '', subject: '', marks: '' });
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to add marks');
    }
  };

  const handleBulkSubmit = async () => {
    try {
      const requests = Object.entries(bulkMarks)
        .filter(([_, marks]) => marks !== '')
        .map(([studentId, marks]) => ({
          studentId: parseInt(studentId),
          subject: bulkSubject,
          marks: parseFloat(marks),
        }));
      if (requests.length === 0) {
        showMessage('error', 'Please enter marks for at least one student');
        return;
      }
      await marksAPI.addBulk(requests);
      showMessage('success', `Marks uploaded for ${requests.length} students`);
      setBulkMarks({});
      setBulkSubject('');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to upload marks');
    }
  };

  const handleViewMarks = async () => {
    if (!selectedStudentId) return;
    await fetchStudentMarks(selectedStudentId);
  };

  const getAverage = () => {
    if (studentMarks.length === 0) return 0;
    const total = studentMarks.reduce((sum, m) => sum + m.marks, 0);
    return (total / studentMarks.length).toFixed(2);
  };

  const subjectOptions = (
    <>
      <option value="">Select Subject</option>
      <option value="Mathematics">Mathematics</option>
      <option value="Physics">Physics</option>
      <option value="Chemistry">Chemistry</option>
      <option value="English">English</option>
      <option value="Computer Science">Computer Science</option>
      <option value="Data Structures">Data Structures</option>
    </>
  );

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
            <h1>My Marks</h1>
            <p>View your subject-wise marks and grades</p>
          </div>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        {studentMarks.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div className="stat-card" style={{ maxWidth: '250px' }}>
              <div className="stat-icon success">📊</div>
              <div className="stat-info">
                <h4>{getAverage()}</h4>
                <p>Average Marks</p>
              </div>
            </div>
          </div>
        )}

        <div className="wdu-card">
          <div className="card-header">
            <h3><FiFileText style={{ marginRight: '0.5rem' }} /> Subject Marks</h3>
          </div>
          {studentMarks.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((record, idx) => {
                    const grade = record.marks >= 90 ? 'A+' : record.marks >= 80 ? 'A' : record.marks >= 70 ? 'B' : record.marks >= 60 ? 'C' : record.marks >= 50 ? 'D' : 'F';
                    const color = record.marks >= 70 ? 'var(--success-light)' : record.marks >= 50 ? 'var(--warning-light)' : 'var(--danger-light)';
                    return (
                      <tr key={record.id}>
                        <td>{idx + 1}</td>
                        <td>{record.subject}</td>
                        <td><strong style={{ color }}>{record.marks}</strong></td>
                        <td><span className="badge" style={{ background: `${color}20`, color }}>{grade}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Marks Yet</h3>
              <p>Your marks haven't been uploaded yet. Check back later.</p>
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
          <h1>Marks Management</h1>
          <p>Upload and view student marks</p>
        </div>
        <div className="tab-switcher" style={{ maxWidth: '280px', marginBottom: 0 }}>
          <button className={`tab-btn ${viewMode === 'upload' ? 'active' : ''}`} onClick={() => setViewMode('upload')}>Upload Marks</button>
          <button className={`tab-btn ${viewMode === 'view' ? 'active' : ''}`} onClick={() => setViewMode('view')}>View Marks</button>
        </div>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      {viewMode === 'upload' ? (
        <div>
          {/* ADMIN and TEACHER can upload marks */}
          {(user?.role === 'ADMIN' || user?.role === 'TEACHER') ? (
            <>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button className={`btn-secondary ${!bulkMode ? 'active' : ''}`} onClick={() => setBulkMode(false)} style={!bulkMode ? { background: 'var(--primary)', color: 'white', border: 'none' } : {}}>
                  Single Entry
                </button>
                <button className={`btn-secondary ${bulkMode ? 'active' : ''}`} onClick={() => setBulkMode(true)} style={bulkMode ? { background: 'var(--primary)', color: 'white', border: 'none' } : {}}>
                  Bulk Upload
                </button>
              </div>

              {!bulkMode ? (
                <div className="wdu-card">
                  <h3 style={{ marginBottom: '1.5rem' }}><FiPlus style={{ marginRight: '0.5rem' }} /> Add Marks</h3>
                  <form onSubmit={handleSingleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Student</label>
                        <select className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                          <option value="">Select Student</option>
                          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Subject</label>
                        <select className="form-select" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                          {subjectOptions}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Marks (out of 100)</label>
                        <input className="form-input" type="number" min="0" max="100" step="0.5" placeholder="Enter marks" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} required />
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.7rem 2rem' }}>Submit Marks</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="wdu-card">
                  <div className="card-header">
                    <h3>Bulk Marks Upload</h3>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <select className="form-select" style={{ width: 'auto', minWidth: '200px' }} value={bulkSubject} onChange={(e) => setBulkSubject(e.target.value)}>
                        {subjectOptions}
                      </select>
                    </div>
                  </div>
                  {students.length > 0 && bulkSubject ? (
                    <>
                      <div className="wdu-table-container">
                        <table className="wdu-table">
                          <thead>
                            <tr><th>#</th><th>Student Name</th><th>Department</th><th>Marks</th></tr>
                          </thead>
                          <tbody>
                            {students.map((student, idx) => (
                              <tr key={student.id}>
                                <td>{idx + 1}</td>
                                <td><strong>{student.name}</strong></td>
                                <td>{student.department}</td>
                                <td>
                                  <input className="form-input" type="number" min="0" max="100" step="0.5" placeholder="Enter marks"
                                    value={bulkMarks[student.id] || ''}
                                    onChange={(e) => setBulkMarks({ ...bulkMarks, [student.id]: e.target.value })}
                                    style={{ width: '120px', padding: '0.4rem 0.6rem' }} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" onClick={handleBulkSubmit} style={{ width: 'auto', padding: '0.7rem 2rem' }}>Upload All Marks</button>
                      </div>
                    </>
                  ) : (
                    <div className="empty-state"><p>{!bulkSubject ? 'Select a subject to begin' : 'No students found'}</p></div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      ) : (
        /* VIEW MODE */
        <div className="wdu-card">
          <div className="card-header">
            <h3><FiFileText style={{ marginRight: '0.5rem' }} /> Student Marks</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select className="form-select" style={{ width: 'auto', minWidth: '200px' }} value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                <option value="">Select Student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="btn-primary" onClick={handleViewMarks} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>View</button>
            </div>
          </div>

          {studentMarks.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="stat-card" style={{ maxWidth: '250px' }}>
                <div className="stat-icon success">📊</div>
                <div className="stat-info">
                  <h4>{getAverage()}</h4>
                  <p>Average Marks</p>
                </div>
              </div>
            </div>
          )}

          {studentMarks.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr><th>#</th><th>Subject</th><th>Marks</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {studentMarks.map((record, idx) => {
                    const grade = record.marks >= 90 ? 'A+' : record.marks >= 80 ? 'A' : record.marks >= 70 ? 'B' : record.marks >= 60 ? 'C' : record.marks >= 50 ? 'D' : 'F';
                    const color = record.marks >= 70 ? 'var(--success-light)' : record.marks >= 50 ? 'var(--warning-light)' : 'var(--danger-light)';
                    return (
                      <tr key={record.id}>
                        <td>{idx + 1}</td>
                        <td>{record.subject}</td>
                        <td><strong style={{ color }}>{record.marks}</strong></td>
                        <td><span className="badge" style={{ background: `${color}20`, color }}>{grade}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : selectedStudentId ? (
            <div className="empty-state"><p>No marks found for this student</p></div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MarksUpload;
