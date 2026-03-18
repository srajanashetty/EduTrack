import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiBook, FiAward, FiEdit2, FiSave, FiX, FiShield, FiBriefcase } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';

const ProfilePage = () => {
    const { user } = useAuth();
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
        <div className="profile-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>My Personal Profile</h1>
                    <p>Manage your account settings and academic information</p>
                </div>
            </div>

            {message.text && <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}

            <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Left Sidebar: Photo & Common Details */}
                <div className="wdu-card" style={{ height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '30px', margin: '0 auto 1.5rem',
                            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', fontWeight: 800, color: '#fff', boxShadow: '0 15px 35px rgba(99,102,241,0.3)',
                            border: '4px solid #fff'
                        }}>
                            {initials}
                        </div>
                        <h2 style={{ marginBottom: '0.25rem' }}>{profile?.name}</h2>
                        <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--primary)', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                            {profile?.role}
                        </span>

                        <hr style={{ margin: '1.5rem 0', opacity: 0.1 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <FiMail className="primary" /> {profile?.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <FiPhone className="primary" /> {profile?.phoneNumber || 'Not provided'}
                            </div>
                        </div>

                        {!isEditing && (
                            <button className="btn-primary mt-3 w-100" style={{ width: '100%' }} onClick={() => setIsEditing(true)}>
                                <FiEdit2 /> Edit Profile
                            </button>
                        )}
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
                                <div className="wdu-card" style={{ padding: '2rem' }}>
                                    <h3>🎓 Academic Record</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div className="stat-card" style={{ flex: '1 1 120px', padding: '1rem' }}>
                                                <small style={{ opacity: 0.6 }}>Department</small>
                                                <p style={{ margin: 0, fontWeight: 700 }}>{profile.department}</p>
                                            </div>
                                            <div className="stat-card" style={{ flex: '1 1 120px', padding: '1rem' }}>
                                                <small style={{ opacity: 0.6 }}>Class/Year</small>
                                                <p style={{ margin: 0, fontWeight: 700 }}>{profile.year}th Year ({profile.section})</p>
                                            </div>
                                            <div className="stat-card" style={{ flex: '1 1 120px', padding: '1rem' }}>
                                                <small style={{ opacity: 0.6 }}>Student ID</small>
                                                <p style={{ margin: 0, fontWeight: 700 }}>ST-{profile.studentId}</p>
                                            </div>
                                            <div className="stat-card" style={{ flex: '1 1 120px', padding: '1rem', background: 'var(--success-light)', color: '#fff' }}>
                                                <small style={{ opacity: 0.8 }}>GPA</small>
                                                <p style={{ margin: 0, fontWeight: 800, fontSize: '1.5rem' }}>{profile.gpa}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ height: '140px', width: '140px', position: 'relative' }}>
                                                <Doughnut data={attendanceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                                    <h3 style={{ margin: 0 }}>{profile.attendancePercentage}%</h3>
                                                    <small style={{ opacity: 0.6 }}>Attendance</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Specific Section */}
                            {profile?.role === 'TEACHER' && (
                                <div className="wdu-card" style={{ padding: '2rem' }}>
                                    <h3>👨‍🏫 Teaching Information</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                                        <div className="stat-card">
                                            <div className="stat-icon primary"><FiBriefcase /></div>
                                            <div className="stat-info">
                                                <h4>{profile.experience || 'N/A'}</h4>
                                                <p>Experience</p>
                                            </div>
                                        </div>
                                        <div className="stat-card">
                                            <div className="stat-icon accent"><FiBook /></div>
                                            <div className="stat-info">
                                                <h4>{profile.teacherDepartment}</h4>
                                                <p>Department</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h4>Subjects Managed</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {profile.subjectsHandled?.map(s => (
                                                <span key={s} className="badge primary" style={{ borderRadius: '6px' }}>{s}</span>
                                            ))}
                                            {!profile.subjectsHandled?.length && <p style={{ opacity: 0.5 }}>No subjects assigned yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Specific Section */}
                            {profile?.role === 'ADMIN' && (
                                <div className="wdu-card" style={{ padding: '2rem' }}>
                                    <h3>🛡️ Administrator Access</h3>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                                            <FiShield className="accent" size={24} /> 
                                            You have full system access permissions (Administrator Role).
                                        </p>
                                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                                            <li>Manage students and faculty records</li>
                                            <li>Override attendance and performance data</li>
                                            <li>Configure institution-wide announcements</li>
                                            <li>System audit logs visibility</li>
                                        </ul>
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
