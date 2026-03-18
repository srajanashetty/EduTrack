import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { examsAPI, studentAPI } from '../services/api';
import { FiPlus, FiClock, FiMapPin, FiTrash2, FiCalendar } from 'react-icons/fi';

const ExamManagement = () => {
    const { user, isAdminOrTeacher, isStudent } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        subject: '', examDate: '', startTime: '', endTime: '',
        location: '', department: '', year: '', section: '',
    });

    const fetchExams = useCallback(async () => {
        setLoading(true);
        try {
            if (isStudent() && user?.studentId) {
                const pRes = await studentAPI.getById(user.studentId);
                setProfile(pRes.data);
                const res = await examsAPI.getByClass({
                    department: pRes.data.department,
                    year: pRes.data.year,
                    section: pRes.data.section
                });
                setExams(res.data);
            } else {
                const res = await examsAPI.getAll();
                setExams(res.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [isStudent, user]);

    useEffect(() => { fetchExams(); }, [fetchExams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await examsAPI.create({ ...form, year: parseInt(form.year) });
            setShowModal(false);
            setForm({ subject: '', examDate: '', startTime: '', endTime: '', location: '', department: '', year: '', section: '' });
            fetchExams();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this exam schedule?')) return;
        try {
            await examsAPI.delete(id);
            fetchExams();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>📝 Examination Schedule</h1>
                    <p>{isStudent() ? `Upcoming exams for ${profile?.department} - Year ${profile?.year}` : 'Manage and schedule institution exams'}</p>
                </div>
                {isAdminOrTeacher() && (
                    <button className="btn-primary" onClick={() => setShowModal(true)}>+ Schedule Exam</button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {exams.length === 0 ? (
                    <div className="empty-state"><h3>No Exams Scheduled</h3></div>
                ) : (
                    exams.map(exam => (
                        <div key={exam.id} className="wdu-card" style={{ borderTop: '4px solid #ef4444' }}>
                            <div style={{ padding: '1.5rem', position: 'relative' }}>
                                <h3 style={{ margin: '0 0 1rem 0' }}>{exam.subject}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <FiCalendar className="primary" /> {new Date(exam.examDate).toLocaleDateString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <FiClock className="primary" /> {exam.startTime} - {exam.endTime}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <FiMapPin className="primary" /> {exam.location}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                        Tag: {exam.department} Yr-{exam.year} Sec-{exam.section}
                                    </div>
                                </div>
                                {isAdminOrTeacher() && (
                                    <button className="btn-icon delete" onClick={() => handleDelete(exam.id)} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Schedule New Exam</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                            <div className="form-group">
                                <label>Subject</label>
                                <input className="form-input" type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Exam Date</label>
                                <input className="form-input" type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group"><label>Start Time</label><input className="form-input" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required /></div>
                                <div className="form-group"><label>End Time</label><input className="form-input" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required /></div>
                            </div>
                            <div className="form-group">
                                <label>Location / Hall No</label>
                                <input className="form-input" type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                <div className="form-group"><label>Dept</label><input className="form-input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required /></div>
                                <div className="form-group"><label>Year</label><input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required /></div>
                                <div className="form-group"><label>Sec</label><input className="form-input" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} required /></div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-success">Schedule Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
