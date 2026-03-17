import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, analyticsAPI, attendanceAPI, marksAPI } from '../services/api';
import { FiUsers, FiCheckSquare, FiTrendingUp, FiAlertTriangle, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
    plugins: { legend: { labels: { color: '#64748B', font: { family: 'Inter', size: 12 } } } },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
      y: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(226,232,240,0.8)' }, min: 0, max: 100 },
    },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#64748B', font: { family: 'Inter', size: 12 }, padding: 20 } } },
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
  const [stats, setStats] = useState({
    totalStudents: 0,
    overallPresent: 0,
    overallAbsent: 0,
    topStudents: [],
    lowAttendance: [],
    performanceData: null,
    attendanceData: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, attendanceRes, performanceRes, topStudentsRes, lowAttendanceRes] =
        await Promise.allSettled([
          studentAPI.getAll(),
          analyticsAPI.getAttendance(),
          analyticsAPI.getPerformance(),
          analyticsAPI.getTopStudents(),
          analyticsAPI.getLowAttendance(),
        ]);

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
    plugins: { legend: { labels: { color: '#64748B', font: { family: 'Inter', size: 12 } } } },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
      y: { ticks: { color: '#64748B', font: { family: 'Inter' } }, grid: { color: 'rgba(226,232,240,0.8)' } },
    },
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#64748B', font: { family: 'Inter', size: 12 }, padding: 20 } } },
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
    <div>
      <div className="page-header">
        <div>
          <h1>Student Performance and Analytical Dashboard</h1>
          <p>Here's an overview of your institution's performance</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FiUsers /></div>
          <div className="stat-info"><h4>{stats.totalStudents}</h4><p>Total Students</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiCheckSquare /></div>
          <div className="stat-info"><h4>{stats.overallPresent}</h4><p>Total Present</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger"><FiAlertTriangle /></div>
          <div className="stat-info"><h4>{stats.overallAbsent}</h4><p>Total Absent</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><FiTrendingUp /></div>
          <div className="stat-info"><h4>{stats.topStudents.length}</h4><p>Top Performers</p></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📊 Subject-wise Performance</h3>
          <div style={{ height: '300px' }}>
            {stats.performanceData?.subjectPerformance?.length > 0 ? (
              <Bar data={performanceChartData} options={chartOptions} />
            ) : (
              <div className="empty-state"><p>No performance data available yet</p></div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>🎯 Overall Attendance</h3>
          <div style={{ height: '300px' }}>
            {stats.overallPresent + stats.overallAbsent > 0 ? (
              <Doughnut data={attendanceChartData} options={doughnutOptions} />
            ) : (
              <div className="empty-state"><p>No attendance data available yet</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid mt-3">
        <div className="wdu-card">
          <div className="card-header"><h3>🏆 Top Performing Students</h3></div>
          {stats.topStudents.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead><tr><th>Rank</th><th>Student</th><th>Avg Marks</th></tr></thead>
                <tbody>
                  {stats.topStudents.slice(0, 5).map((s) => (
                    <tr key={s.studentId}>
                      <td>#{s.rank}</td>
                      <td>{s.studentName}</td>
                      <td><strong style={{ color: 'var(--success-light)' }}>{s.averageMarks}%</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No marks data available yet</p></div>
          )}
        </div>

        <div className="wdu-card">
          <div className="card-header"><h3>⚠️ Low Attendance Students</h3></div>
          {stats.lowAttendance.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead><tr><th>Student</th><th>Attendance %</th><th>Status</th></tr></thead>
                <tbody>
                  {stats.lowAttendance.slice(0, 5).map((s) => (
                    <tr key={s.studentId}>
                      <td>{s.studentName}</td>
                      <td><strong style={{ color: 'var(--danger-light)' }}>{s.attendancePercentage}%</strong></td>
                      <td><span className="badge absent">At Risk</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No low attendance alerts</p></div>
          )}
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
