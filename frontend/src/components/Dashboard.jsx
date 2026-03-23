import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI, analyticsAPI, attendanceAPI, marksAPI, activitiesAPI } from '../services/api';
import { FiUsers, FiCheckSquare, FiTrendingUp, FiAlertTriangle, FiFileText, FiBarChart2, FiBell, FiActivity } from 'react-icons/fi';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

/* =================== STUDENT PERSONAL DASHBOARD =================== */
const StudentDashboard = ({ user }) => {
  const [marks, setMarks] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const sid = user?.studentId;
      if (!sid) { setLoading(false); return; }
      try {
        const [marksRes, statsRes, profileRes] = await Promise.allSettled([
          marksAPI.getByStudent(sid),
          attendanceAPI.getStudentStats(sid),
          studentAPI.getById(sid),
        ]);
        if (marksRes.status === 'fulfilled') setMarks(marksRes.value.data);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);

  const avgMarks = marks.length > 0
    ? (marks.reduce((s, m) => s + m.marks, 0) / marks.length).toFixed(1)
    : 0;

  const marksChartData = {
    labels: marks.map((m) => m.subject),
    datasets: [{
      label: 'My Marks',
      data: marks.map((m) => m.marks),
      backgroundColor: marks.map((m) =>
        m.marks >= 70 ? 'rgba(16,185,129,0.7)' : m.marks >= 50 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)'
      ),
      borderColor: marks.map((m) =>
        m.marks >= 70 ? '#10b981' : m.marks >= 50 ? '#f59e0b' : '#ef4444'
      ),
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [stats?.presentDays || 0, stats?.absentDays || 0],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#10b981', '#ef4444'],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#64748B', font: { family: 'Roboto', size: 12 } } } },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Roboto' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
      y: { ticks: { color: '#64748B', font: { family: 'Roboto' } }, grid: { color: 'rgba(226,232,240,0.8)' }, min: 0, max: 100 },
    },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#64748B', font: { family: 'Roboto', size: 12 }, padding: 20 } } },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {profile?.name || user?.username} 👋</h1>
          <p>{profile ? `${profile.department} · Year ${profile.year} · Section ${profile.section}` : 'Your personal academic dashboard'}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiFileText /></div>
          <div className="stat-info"><h4>{marks.length}</h4><p>Subjects Recorded</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><FiBarChart2 /></div>
          <div className="stat-info"><h4>{avgMarks}</h4><p>Average Marks</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiCheckSquare /></div>
          <div className="stat-info"><h4>{stats?.presentDays ?? '—'}</h4><p>Days Present</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">%</div>
          <div className="stat-info">
            <h4 style={{ color: (stats?.attendancePercentage ?? 0) >= 75 ? 'var(--success-light)' : 'var(--danger-light)' }}>
              {stats?.attendancePercentage ?? '—'}%
            </h4>
            <p>Attendance</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>📊 My Subject Marks</h3>
          <div style={{ height: '300px' }}>
            {marks.length > 0 ? (
              <Bar data={marksChartData} options={chartOptions} />
            ) : (
              <div className="empty-state"><p>No marks recorded yet</p></div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>🎯 My Attendance</h3>
          <div style={{ height: '300px' }}>
            {(stats?.presentDays || 0) + (stats?.absentDays || 0) > 0 ? (
              <Doughnut data={attendanceChartData} options={doughnutOptions} />
            ) : (
              <div className="empty-state"><p>No attendance data yet</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Marks table */}
      {marks.length > 0 && (
        <div className="wdu-card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3>📝 My Marks Detail</h3>
          </div>
          <div className="wdu-table-container">
            <table className="wdu-table">
              <thead>
                <tr><th>#</th><th>Subject</th><th>Marks</th><th>Grade</th></tr>
              </thead>
              <tbody>
                {marks.map((record, idx) => {
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
        </div>
      )}
    </div>
  );
};

/* =================== ADMIN / TEACHER DASHBOARD =================== */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    overallPresent: 0,
    overallAbsent: 0,
    topStudents: [],
    lowAttendance: [],
    performanceData: null,
    attendanceData: null,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / 60000);
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return past.toLocaleDateString();
  };

  // Helper to get activity icon
  const getActivityIcon = (type) => {
    switch(type) {
      case 'attendance': return <FiCheckSquare color="#10b981" />;
      case 'marks': return <FiTrendingUp color="#6366f1" />;
      case 'student': return <FiUsers color="#f59e0b" />;
      case 'announcement': return <FiBell color="#ef4444" />;
      default: return <FiActivity color="#64748b" />;
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Real-time polling simulation
    const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, attendanceRes, performanceRes, topStudentsRes, lowAttendanceRes, activitiesRes] =
        await Promise.allSettled([
          studentAPI.getAll(),
          analyticsAPI.getAttendance(),
          analyticsAPI.getPerformance(),
          analyticsAPI.getTopStudents(),
          analyticsAPI.getLowAttendance(),
          activitiesAPI.getRecent(),
        ]);

      if (activitiesRes.status === 'fulfilled') {
        const mapped = activitiesRes.value.data.map(a => ({
          id: a.id,
          type: a.type,
          text: a.message,
          time: getRelativeTime(a.timestamp),
          icon: getActivityIcon(a.type)
        }));
        setActivities(mapped);
      }

      setStats({
        totalStudents: studentsRes.status === 'fulfilled' ? studentsRes.value.data.length : 0,
        overallPresent: attendanceRes.status === 'fulfilled' ? attendanceRes.value.data.overallPresent || 0 : 0,
        overallAbsent: attendanceRes.status === 'fulfilled' ? attendanceRes.value.data.overallAbsent || 0 : 0,
        topStudents: topStudentsRes.status === 'fulfilled' ? topStudentsRes.value.data : [],
        lowAttendance: lowAttendanceRes.status === 'fulfilled' ? lowAttendanceRes.value.data : [],
        performanceData: performanceRes.status === 'fulfilled' ? performanceRes.value.data : null,
        attendanceData: attendanceRes.status === 'fulfilled' ? attendanceRes.value.data : null,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const performanceChartData = {
    labels: stats.performanceData?.subjectPerformance?.map((s) => s.subject) || [],
    datasets: [{
      label: 'Average Marks',
      data: stats.performanceData?.subjectPerformance?.map((s) => s.averageMarks) || [],
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(6,182,212,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)', 'rgba(139,92,246,0.7)'],
      borderColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 2, borderRadius: 8,
    }],
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [stats.overallPresent, stats.overallAbsent],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#10b981', '#ef4444'],
      borderWidth: 2, hoverOffset: 8,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#64748B', font: { family: 'Roboto', size: 12 } } } },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Roboto' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
      y: { ticks: { color: '#64748B', font: { family: 'Roboto' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
    },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#64748B', font: { family: 'Roboto', size: 11 }, padding: 15 } } },
  };

  // Weekly Trend Data (Mocked)
  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Avg Performance',
      data: [65, 68, 72, 70, 75, 78],
      borderColor: 'var(--secondary)',
      backgroundColor: 'rgba(61, 139, 64, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem' }}>Institutional Intelligence</h1>
          <p>Real-time oversight of student performance and engagement</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => navigate('/students')} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>+ Student</button>
          <button className="btn-secondary" onClick={() => navigate('/attendance')} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Mark Attendance</button>
          <button className="btn-primary" onClick={() => navigate('/marks')} style={{ width: 'auto', fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>Upload Marks</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon primary"><FiUsers /></div>
          <div className="stat-info"><h4>{stats.totalStudents}</h4><p>Total Directory</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiCheckSquare /></div>
          <div className="stat-info"><h4>{stats.overallPresent}</h4><p>Daily Attendance</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger"><FiAlertTriangle /></div>
          <div className="stat-info"><h4>{stats.lowAttendance.length}</h4><p>At-Risk Students</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><FiTrendingUp /></div>
          <div className="stat-info"><h4>{stats.topStudents.length}</h4><p>Excellence Hub</p></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Insights Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Performance Trends */}
          <div className="wdu-card">
            <div className="card-header">
              <h3>📈 Weekly Performance Trend</h3>
              <span className="badge present">Update: Just now</span>
            </div>
            <div style={{ height: '280px' }}>
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="wdu-card">
              <div className="card-header"><h3>📊 Avg Marks by Subject</h3></div>
              <div style={{ height: '240px' }}>
                <Bar data={performanceChartData} options={chartOptions} />
              </div>
            </div>
            <div className="wdu-card">
              <div className="card-header"><h3>🎯 Overall Engagement</h3></div>
              <div style={{ height: '240px' }}>
                <Doughnut data={attendanceChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          <div className="wdu-card">
            <div className="card-header"><h3>🛡️ Smart Insights</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ color: '#991b1b', fontWeight: 700, margin: 0 }}>Attendance Alert</p>
                <h4 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.2rem' }}>{stats.lowAttendance.length} Students below 75%</h4>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={() => navigate('/analytics')}>Review Records</button>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ color: '#166534', fontWeight: 700, margin: 0 }}>Growth Tracking</p>
                <h4 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.2rem' }}>Average Marks improved by 8.4%</h4>
                <p style={{ fontSize: '0.75rem', color: '#166534', margin: 0 }}>Compared to previous semester</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="wdu-card" style={{ height: '100%' }}>
            <div className="card-header">
              <h3>⚡ Recent Activity</h3>
            </div>
            <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activities.map(act => (
                <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    padding: '0.6rem', background: '#f8fafc', borderRadius: '10px', 
                    fontSize: '1.1rem', display: 'flex' 
                  }}>
                    {act.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{act.text}</p>
                    <small style={{ color: 'var(--text-secondary)' }}>{act.time}</small>
                  </div>
                </div>
              ))}
            </div>
            <hr style={{ margin: '2rem 0 1.5rem', border: 'none', borderTop: '1px solid var(--border-light)' }} />
            <div className="top-performer-mini">
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>🏆 Top Performers</h4>
              {stats.topStudents.slice(0, 3).map(s => (
                <div key={s.studentId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <span>{s.studentName}</span>
                  <strong style={{ color: 'var(--secondary)' }}>{s.averageMarks}%</strong>
                </div>
              ))}
              <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem' }} onClick={() => navigate('/analytics')}>View Board</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== ROOT EXPORT ===================== */
const Dashboard = () => {
  const { user, isStudent } = useAuth();

  if (isStudent()) {
    return <StudentDashboard user={user} />;
  }
  return <AdminDashboard />;
};

export default Dashboard;
