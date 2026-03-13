import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers } from 'react-icons/fi';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    name: '', email: '', department: '', year: '', section: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setForm({
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year.toString(),
        section: student.section,
      });
    } else {
      setEditingStudent(null);
      setForm({ name: '', email: '', department: '', year: '', section: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, year: parseInt(form.year) };
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, data);
        showMessage('success', 'Student updated successfully');
      } else {
        await studentAPI.create(data);
        showMessage('success', 'Student added successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        showMessage('success', 'Student deleted successfully');
        fetchStudents();
      } catch (err) {
        showMessage('error', 'Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading students...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Add, edit, and manage student records</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ width: 'auto', padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus /> Add Student
        </button>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      <div className="wdu-card">
        <div className="card-header">
          <h3><FiUsers style={{ marginRight: '0.5rem' }} /> All Students ({filteredStudents.length})</h3>
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="wdu-table-container">
            <table className="wdu-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{student.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{student.email}</td>
                    <td>{student.department}</td>
                    <td>{student.year}</td>
                    <td>{student.section}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon edit" onClick={() => handleOpenModal(student)} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(student.id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Students Found</h3>
            <p>Add your first student to get started</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" type="text" placeholder="Enter student name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" placeholder="Enter email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                  <option value="EE">Electrical</option>
                  <option value="IT">Information Technology</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Year</label>
                  <select className="form-select" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select className="form-select" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} required>
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-success">{editingStudent ? 'Update' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
