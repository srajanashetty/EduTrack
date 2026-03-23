import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiBook, FiAward, FiEdit2, FiSave, FiX, FiShield, FiBriefcase, FiTrendingUp, FiCheckSquare, FiClock, FiCalendar, FiUsers, FiActivity, FiArrowRight, FiFileText } from 'react-icons/fi';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await profileAPI.get();
            setProfile(res.data);
            setForm(res.data);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile details' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await profileAPI.update(form);
            setProfile(res.data);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Update failed. Please check your details.' });
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    const initials = (profile?.name || user?.username || '?').slice(0, 2).toUpperCase();

    const attendanceData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [profile?.attendancePercentage || 0, 100 - (profile?.attendancePercentage || 0)],
            backgroundColor: ['#10b981', '#f1f5f9'],
            borderWidth: 0,
            cutout: '80%'
        }]
    };

    return (
        <div className="profile-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Identity & Performance</h1>
                    <p>Verified institutional profile and comprehensive data oversight</p>
                </div>
                {!isEditing && (
                    <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.5rem' }} onClick={() => setIsEditing(true)}>
                        <FiEdit2 /> Update Details
                    </button>
                )}
            </div>

            {message.text && <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}

            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                <div className="profile-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="wdu-card" style={{ height: 'fit-content', padding: '2rem 1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '28px', margin: '0 auto 1.25rem',
                                background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', fontWeight: 800, color: '#fff', boxShadow: 'var(--shadow-lg)',
                                border: '3px solid #fff'
                            }}>
                                {initials}
                            </div>
                            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>{profile?.name}</h2>
                            <div className="role-tag" style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                background: 'rgba(61, 139, 64, 0.1)', color: 'var(--secondary)', 
                                padding: '0.2rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700
                             }}>
                                <FiShield size={12} /> {profile?.role}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <FiMail className="secondary" /> {profile?.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <FiPhone className="secondary" /> {profile?.phoneNumber || 'Not provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Schedule Mini-Card */}
                    <div className="wdu-card" style={{ padding: '1.25rem' }}>
                        <div className="card-header" style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiClock /> Today's Focus
                            </h4>
                        </div>
                        <div className="schedule-mini" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '0.75rem' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>09:00 AM - Advanced Math</p>
                                <small style={{ color: 'var(--text-secondary)' }}>Room 402 · Lecture</small>
                            </div>
                            <div style={{ borderLeft: '3px solid #cbd5e1', paddingLeft: '0.75rem' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>11:30 AM - Data Structures</p>
                                <small style={{ color: 'var(--text-secondary)' }}>Lab 01 · Seminar</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Stats & Academic Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {isEditing ? (
                        <div className="wdu-card">
                            <div className="card-header"><h3>✏️ Update Information</h3></div>
                            <form onSubmit={handleUpdate} style={{ padding: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input className="form-input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+1 (234) 567-890" />
                                </div>
                                <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                                    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn-success"><FiSave /> Save Changes</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Student Specific Section */}
                            {profile?.role === 'STUDENT' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                        <div className="stat-card">
                                            <div className="stat-icon success"><FiCheckSquare /></div>
                                            <div className="stat-info"><h4>{profile.attendancePercentage}%</h4><p>Attendance</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon accent"><FiAward /></div>
                                            <div className="stat-info"><h4>{profile.gpa || '3.8'}</h4><p>Overall GPA</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon primary"><FiBook /></div>
                                            <div className="stat-info"><h4>6</h4><p>Active Courses</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon success"><FiTrendingUp /></div>
                                            <div className="stat-info"><h4>Top 5%</h4><p>Class Rank</p></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="wdu-card" style={{ padding: '1.5rem' }}>
                                            <div className="card-header"><h3>🎓 Academic Trajectory</h3></div>
                                            <div style={{ height: '220px' }}>
                                                <Line 
                                                    data={{
                                                        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                                                        datasets: [{ label: 'GPA', data: [3.2, 3.5, 3.8, 3.9], borderColor: 'var(--secondary)', tension: 0.4 }]
                                                    }} 
                                                    options={{ responsive: true, maintainAspectRatio: false }} 
                                                />
                                            </div>
                                        </div>
                                        <div className="wdu-card" style={{ padding: '1.5rem' }}>
                                            <div className="card-header"><h3>🚩 Alerts & Actions</h3></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '1rem' }}>
                                                    <p style={{ color: '#991b1b', fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>Exam Warning</p>
                                                    <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>Advanced Calculus Mid-term in 3 days.</p>
                                                </div>
                                                <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '10px', padding: '1rem' }}>
                                                    <p style={{ color: '#166534', fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>Attendance Goal</p>
                                                    <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>You maintained 90%+ attendance this month!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="wdu-card">
                                        <div className="card-header"><h3>📚 Enrolled Courses</h3></div>
                                        <div className="wdu-table-container">
                                            <table className="wdu-table">
                                                <thead><tr><th>Course</th><th>Professor</th><th>Status</th><th>Performance</th></tr></thead>
                                                <tbody>
                                                    <tr><td>Data Structures</td><td>Dr. Smith</td><td><span className="badge present">Active</span></td><td><strong className="success">A+</strong></td></tr>
                                                    <tr><td>Machine Learning</td><td>Dr. Jones</td><td><span className="badge present">Active</span></td><td><strong className="success">A</strong></td></tr>
                                                    <tr><td>Discrete Math</td><td>Dr. Brown</td><td><span className="badge absent">At Risk</span></td><td><strong className="danger">C</strong></td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Specific Section */}
                            {profile?.role === 'TEACHER' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                        <div className="stat-card">
                                            <div className="stat-icon primary"><FiUsers /></div>
                                            <div className="stat-info"><h4>142</h4><p>Total Students</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon success"><FiCheckSquare /></div>
                                            <div className="stat-info"><h4>88%</h4><p>Avg Attendance</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon accent"><FiBriefcase /></div>
                                            <div className="stat-info"><h4>{profile.experience}</h4><p>Experience</p></div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon warning"><FiActivity /></div>
                                            <div className="stat-info"><h4>72%</h4><p>Pass Rate</p></div>
                                        </div>
                                    </div>

                                    <div className="wdu-card">
                                        <div className="card-header"><h3>👨‍🏫 Teaching Dashboard</h3></div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', padding: '1rem' }}>
                                            <div style={{ height: '300px' }}>
                                                <Bar 
                                                    data={{
                                                        labels: profile.subjectsHandled || [],
                                                        datasets: [{ label: 'Performance Index', data: [75, 82, 68], backgroundColor: 'rgba(61, 139, 64, 0.7)', borderRadius: 8 }]
                                                    }}
                                                    options={{ responsive: true, maintainAspectRatio: false }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <h4 style={{ fontSize: '0.9rem' }}>Recent Activity</h4>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}><FiCheckSquare /> Attendance marked (IT-2A)</div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}><FiSave /> Mid-term marks uploaded (CSE-3)</div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}><FiActivity /> Published new assignment</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Specific Section */}
                            {profile?.role === 'ADMIN' && (
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
                                    <div className="wdu-card" style={{ flex: 2, padding: '2rem' }}>
                                        <div className="card-header"><h3>🛡️ Administrative Command Center</h3></div>
                                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', marginTop: '1rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1rem' }}>Strategic Overview</h4>
                                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiUsers className="success" /> 2,490 Verified Scholars</li>
                                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiBriefcase className="accent" /> 112 Active Faculty</li>
                                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiActivity className="primary" /> 94% System Uptime</li>
                                                    </ul>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '1rem' }}>Quick Governance</h4>
                                                    <button className="btn-secondary" style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'flex-start' }} onClick={() => navigate('/students')}><FiUsers /> Directory Audit</button>
                                                    <button className="btn-secondary" style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'flex-start' }} onClick={() => navigate('/reports')}><FiFileText /> Performance Analytics</button>
                                                    <button className="btn-primary" style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'flex-start', background: 'var(--secondary)' }} onClick={() => navigate('/announcements')}><FiActivity /> Push Global Notice</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
