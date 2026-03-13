import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const AnalyticsDashboard = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [lowAttendance, setLowAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [attRes, perfRes, topRes, lowRes] = await Promise.allSettled([
        analyticsAPI.getAttendance(),
        analyticsAPI.getPerformance(),
        analyticsAPI.getTopStudents(),
        analyticsAPI.getLowAttendance(),
      ]);
      setAttendanceData(attRes.status === 'fulfilled' ? attRes.value.data : null);
      setPerformanceData(perfRes.status === 'fulfilled' ? perfRes.value.data : null);
      setTopStudents(topRes.status === 'fulfilled' ? topRes.value.data : []);
      setLowAttendance(lowRes.status === 'fulfilled' ? lowRes.value.data : []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartColors = [
    'rgba(99, 102, 241, 0.7)',
    'rgba(6, 182, 212, 0.7)',
    'rgba(16, 185, 129, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(239, 68, 68, 0.7)',
    'rgba(139, 92, 246, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(249, 115, 22, 0.7)',
    'rgba(34, 197, 94, 0.7)',
    'rgba(59, 130, 246, 0.7)',
  ];

  const chartBorders = chartColors.map((c) => c.replace('0.7', '1'));

  const baseChartOptions = {
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748B', font: { family: 'Inter', size: 12 }, padding: 15 },
      },
    },
  };

  // Student Performance Bar Chart
  const performanceBarData = {
    labels: performanceData?.studentPerformance?.slice(0, 10).map((s) => s.studentName) || [],
    datasets: [
      {
        label: 'Average Marks',
        data: performanceData?.studentPerformance?.slice(0, 10).map((s) => s.averageMarks) || [],
        backgroundColor: chartColors,
        borderColor: chartBorders,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Attendance Pie Chart
  const attendancePieData = {
    labels: attendanceData?.students?.map((s) => s.studentName) || [],
    datasets: [
      {
        data: attendanceData?.students?.map((s) => s.attendancePercentage) || [],
        backgroundColor: chartColors,
        borderColor: chartBorders,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // Progress Line Chart
  const progressLineData = {
    labels: topStudents.map((s) => s.studentName),
    datasets: [
      {
        label: 'Average Marks Trend',
        data: topStudents.map((s) => s.averageMarks),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Subject Performance Bar Chart
  const subjectBarData = {
    labels: performanceData?.subjectPerformance?.map((s) => s.subject) || [],
    datasets: [
      {
        label: 'Average Marks by Subject',
        data: performanceData?.subjectPerformance?.map((s) => s.averageMarks) || [],
        backgroundColor: chartColors,
        borderColor: chartBorders,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive performance and attendance analytics</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-info">
            <h4>{attendanceData?.totalStudents || 0}</h4>
            <p>Students Tracked</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">✓</div>
          <div className="stat-info">
            <h4>{attendanceData?.overallPresent || 0}</h4>
            <p>Total Present</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon danger">✗</div>
          <div className="stat-info">
            <h4>{attendanceData?.overallAbsent || 0}</h4>
            <p>Total Absent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⚠</div>
          <div className="stat-info">
            <h4>{lowAttendance.length}</h4>
            <p>Low Attendance</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📊 Student Performance (Bar Chart)</h3>
          <div style={{ height: '350px' }}>
            {performanceData?.studentPerformance?.length > 0 ? (
              <Bar data={performanceBarData} options={baseChartOptions} />
            ) : (
              <div className="empty-state"><p>No performance data available</p></div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>🎯 Attendance Distribution (Pie Chart)</h3>
          <div style={{ height: '350px' }}>
            {attendanceData?.students?.length > 0 ? (
              <Pie data={attendancePieData} options={pieOptions} />
            ) : (
              <div className="empty-state"><p>No attendance data available</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid mt-3">
        <div className="chart-container">
          <h3>📈 Progress Trends (Line Chart)</h3>
          <div style={{ height: '350px' }}>
            {topStudents.length > 0 ? (
              <Line data={progressLineData} options={baseChartOptions} />
            ) : (
              <div className="empty-state"><p>No trend data available</p></div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>📚 Subject-wise Average (Bar Chart)</h3>
          <div style={{ height: '350px' }}>
            {performanceData?.subjectPerformance?.length > 0 ? (
              <Bar data={subjectBarData} options={baseChartOptions} />
            ) : (
              <div className="empty-state"><p>No subject data available</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid mt-3">
        <div className="wdu-card">
          <div className="card-header">
            <h3>🏆 Top 10 Students by Marks</h3>
          </div>
          {topStudents.length > 0 ? (
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
                  {topStudents.map((s) => (
                    <tr key={s.studentId}>
                      <td style={{ fontWeight: 600 }}>#{s.rank}</td>
                      <td>{s.studentName}</td>
                      <td><strong style={{ color: 'var(--success-light)' }}>{s.averageMarks}%</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No data available</p></div>
          )}
        </div>

        <div className="wdu-card">
          <div className="card-header">
            <h3>⚠️ Students with Low Attendance (&lt;75%)</h3>
          </div>
          {lowAttendance.length > 0 ? (
            <div className="wdu-table-container">
              <table className="wdu-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Present</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {lowAttendance.map((s) => (
                    <tr key={s.studentId}>
                      <td>{s.studentName}</td>
                      <td>{s.presentDays}</td>
                      <td>{s.totalDays}</td>
                      <td><strong style={{ color: 'var(--danger-light)' }}>{s.attendancePercentage}%</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>All students have satisfactory attendance!</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
