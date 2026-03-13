import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, analyticsAPI } from '../services/api';
import { FiUsers, FiCheckSquare, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
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

const Dashboard = () => {
  const { user } = useAuth();
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
    datasets: [
      {
        label: 'Average Marks',
        data: stats.performanceData?.subjectPerformance?.map((s) => s.averageMarks) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
        ],
        borderColor: [
          '#6366f1',
          '#06b6d4',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const attendanceChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [stats.overallPresent, stats.overallAbsent],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#64748B', font: { family: 'Inter', size: 12 } },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748B', font: { family: 'Inter' } },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
      },
      y: {
        ticks: { color: '#64748B', font: { family: 'Inter' } },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748B', font: { family: 'Inter', size: 12 }, padding: 20 },
      },
    },
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
          <div className="stat-info">
            <h4>{stats.totalStudents}</h4>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><FiCheckSquare /></div>
          <div className="stat-info">
            <h4>{stats.overallPresent}</h4>
            <p>Total Present</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger"><FiAlertTriangle /></div>
          <div className="stat-info">
            <h4>{stats.overallAbsent}</h4>
            <p>Total Absent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><FiTrendingUp /></div>
          <div className="stat-info">
            <h4>{stats.topStudents.length}</h4>
            <p>Top Performers</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📊 Subject-wise Performance</h3>
          <div style={{ height: '300px' }}>
            {stats.performanceData?.subjectPerformance?.length > 0 ? (
              <Bar data={performanceChartData} options={chartOptions} />
            ) : (
              <div className="empty-state">
                <p>No performance data available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>🎯 Overall Attendance</h3>
          <div style={{ height: '300px' }}>
            {stats.overallPresent + stats.overallAbsent > 0 ? (
              <Doughnut data={attendanceChartData} options={doughnutOptions} />
            ) : (
              <div className="empty-state">
                <p>No attendance data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid mt-3">
        <div className="wdu-card">
          <div className="card-header">
            <h3>🏆 Top Performing Students</h3>
          </div>
          {stats.topStudents.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Avg Marks</th>
                  </tr>
                </thead>
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
            <div className="empty-state">
              <p>No marks data available yet</p>
            </div>
          )}
        </div>

        <div className="wdu-card">
          <div className="card-header">
            <h3>⚠️ Low Attendance Students</h3>
          </div>
          {stats.lowAttendance.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
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
            <div className="empty-state">
              <p>No low attendance alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
