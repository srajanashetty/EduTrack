import { useState, useEffect } from 'react';
import { studentAPI, subjectsAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers, FiBook } from 'react-icons/fi';

const sectionsList = ['All', 'A', 'B', 'C', 'D'];

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Section State
  const [activeSection, setActiveSection] = useState('All');

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', department: '', year: '', section: '',
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '', section: '', department: ''
  });

  useEffect(() => {
    fetchData(activeSection);
  }, [activeSection]);

  const fetchData = async (section) => {
    setLoading(true);
    try {
      const dbSection = section === 'All' ? '' : section;
      const [studentsRes, subjectsRes] = await Promise.all([
        studentAPI.getAll(dbSection),
        subjectsAPI.getSubjects(dbSection)
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleOpenStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setStudentForm({
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year.toString(),
        section: student.section,
      });
    } else {
      setEditingStudent(null);
      setStudentForm({ name: '', email: '', department: '', year: '', section: activeSection === 'All' ? '' : activeSection });
    }
    setShowStudentModal(true);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...studentForm, year: parseInt(studentForm.year) };
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, data);
        showMessage('success', 'Student updated successfully');
      } else {
        await studentAPI.create(data);
        showMessage('success', 'Student added successfully');
      }
      setShowStudentModal(false);
      fetchData(activeSection);
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Operation failed');
    }
  };

  const handleStudentDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        showMessage('success', 'Student deleted successfully');
        fetchData(activeSection);
      } catch (err) {
        showMessage('error', 'Failed to delete student');
      }
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await subjectsAPI.addSubject(subjectForm);
      showMessage('success', 'Subject added successfully');
      setShowSubjectModal(false);
      setSubjectForm({ name: '', section: '', department: '' });
      fetchData(activeSection);
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to add subject');
    }
  };

  const handleSubjectDelete = async (id) => {
    if (window.confirm('Remove this subject?')) {
      try {
        await subjectsAPI.deleteSubject(id);
        showMessage('success', 'Subject removed');
        fetchData(activeSection);
      } catch (err) {
        showMessage('error', 'Failed to remove subject');
      }
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && students.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading section details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>Student Directory & Subjects</h1>
          <p>Manage section-wise student records and subjects dynamically</p>
        </div>
      </div>

      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      {/* Tabs for Section Selection */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '2rem', 
        background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '12px',
        overflowX: 'auto', border: '1px solid var(--border-color)'
      }}>
        {sectionsList.map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            style={{
              padding: '0.6rem 2rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: activeSection === sec ? 'var(--primary)' : 'transparent',
              color: activeSection === sec ? 'white' : 'var(--text-secondary)',
            }}
          >
            {sec === 'All' ? 'All Sections' : `Section ${sec}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Subjects Module */}
        <div className="wdu-card">
          <div className="card-header">
            <div>
              <h3><FiBook style={{ marginRight: '0.5rem' }} /> Assigned Subjects {activeSection !== 'All' && `- Section ${activeSection}`}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Dynamic curriculum overview</p>
            </div>
            <button className="btn-secondary" onClick={() => {
              setSubjectForm({ ...subjectForm, section: activeSection === 'All' ? '' : activeSection });
              setShowSubjectModal(true);
            }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <FiPlus /> Add Subject
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {subjects.length > 0 ? subjects.map(sub => (
              <div key={sub.id} style={{
                background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid var(--border-light)',
                borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{sub.name}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Sec {sub.section}</span>
                    <span style={{ background: 'var(--text-secondary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{sub.department}</span>
                  </div>
                </div>
                <button onClick={() => handleSubjectDelete(sub.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.2rem' }}>
                  <FiTrash2 />
                </button>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No subjects assigned to {activeSection === 'All' ? 'any section' : `Section ${activeSection}`} yet.
              </div>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="wdu-card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3><FiUsers style={{ marginRight: '0.5rem' }} /> Students Directory ({filteredStudents.length})</h3>
              {activeSection !== 'All' && (
                <span className="badge" style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                  Section: {activeSection}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => handleOpenStudentModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPlus /> Enroll
              </button>
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
                      <td>
                         <span style={{ 
                            background: `rgba(var(--primary-rgb), 0.1)`, 
                            color: 'var(--primary)', 
                            padding: '0.2rem 0.6rem', 
                            borderRadius: '4px',
                            fontWeight: 'bold'
                         }}>
                           {student.section}
                         </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-icon edit" onClick={() => handleOpenStudentModal(student)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleStudentDelete(student.id)} title="Delete">
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
              <p>No students enrolled in {activeSection === 'All' ? 'the directory' : `Section ${activeSection}`} yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT MODAL */}
      {showStudentModal && (
        <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="card-header">
              <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>{editingStudent ? 'Update Scholar Record' : 'Enroll New Scholar'}</h2>
            </div>
            <form onSubmit={handleStudentSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" type="text" placeholder="e.g. Alexander Pierce" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-input" type="email" placeholder="student@university.edu" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-select" value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })} required>
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science & Engineering</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                  <option value="IT">Information Technology</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Academic Year</label>
                  <select className="form-select" value={studentForm.year} onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })} required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select className="form-select" value={studentForm.section} onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })} required>
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowStudentModal(false)}>Discard</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }}>
                  {editingStudent ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="card-header">
              <h2 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Add New Subject</h2>
            </div>
            <form onSubmit={handleSubjectSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Subject Name</label>
                <input className="form-input" type="text" placeholder="e.g. Data Structures" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Department</label>
                  <select className="form-select" value={subjectForm.department} onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })} required>
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <select className="form-select" value={subjectForm.section} onChange={(e) => setSubjectForm({ ...subjectForm, section: e.target.value })} required>
                    <option value="">Select Sec</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowSubjectModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2.5rem' }}>
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentManagement;
