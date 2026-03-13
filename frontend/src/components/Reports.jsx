import { useState, useEffect } from 'react';
import { analyticsAPI, studentAPI } from '../services/api';
import { FiDownload, FiPrinter } from 'react-icons/fi';

const Reports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [attendanceData, setAttendanceData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [attRes, perfRes, topRes, studentsRes] = await Promise.allSettled([
        analyticsAPI.getAttendance(),
        analyticsAPI.getPerformance(),
        analyticsAPI.getTopStudents(),
        studentAPI.getAll(),
      ]);
      setAttendanceData(attRes.status === 'fulfilled' ? attRes.value.data : null);
      setPerformanceData(perfRes.status === 'fulfilled' ? perfRes.value.data : null);
      setTopStudents(topRes.status === 'fulfilled' ? topRes.value.data : []);
      setStudents(studentsRes.status === 'fulfilled' ? studentsRes.value.data : []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = '';
    let filename = '';

    if (reportType === 'attendance') {
      csv = 'Student ID,Student Name,Total Days,Present Days,Absent Days,Percentage\n';
      attendanceData?.students?.forEach((s) => {
        csv += `${s.studentId},${s.studentName},${s.totalDays},${s.presentDays},${s.absentDays},${s.attendancePercentage}\n`;
      });
      filename = 'attendance_report.csv';
    } else if (reportType === 'performance') {
      csv = 'Student ID,Student Name,Average Marks\n';
      performanceData?.studentPerformance?.forEach((s) => {
        csv += `${s.studentId},${s.studentName},${s.averageMarks}\n`;
      });
      filename = 'performance_report.csv';
    } else if (reportType === 'students') {
      csv = 'ID,Name,Email,Department,Year,Section\n';
      students.forEach((s) => {
        csv += `${s.id},${s.name},${s.email},${s.department},${s.year},${s.section}\n`;
      });
      filename = 'students_report.csv';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Generate and export detailed reports</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiPrinter /> Print
          </button>
          <button className="btn-success" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="report-filters">
        <select
          className="form-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{ width: 'auto', minWidth: '220px' }}
        >
          <option value="attendance">Attendance Report</option>
          <option value="performance">Performance Report</option>
          <option value="students">Student Directory</option>
          <option value="top">Top Students Report</option>
        </select>
      </div>

      <div className="wdu-card" id="report-content">
        {reportType === 'attendance' && (
          <>
            <div className="card-header">
              <h3>📋 Attendance Report</h3>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>

            {attendanceData?.students?.length > 0 ? (
              <div className="wdu-table-container">
                <table className="wdu-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Total Days</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.students.map((s) => (
                      <tr key={s.studentId}>
                        <td>{s.studentId}</td>
                        <td><strong>{s.studentName}</strong></td>
                        <td>{s.totalDays}</td>
                        <td style={{ color: 'var(--success-light)' }}>{s.presentDays}</td>
                        <td style={{ color: 'var(--danger-light)' }}>{s.absentDays}</td>
                        <td><strong>{s.attendancePercentage}%</strong></td>
                        <td>
                          <span className={`badge ${s.attendancePercentage >= 75 ? 'present' : 'absent'}`}>
                            {s.attendancePercentage >= 75 ? 'Good' : 'At Risk'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state"><p>No attendance data available</p></div>
            )}
          </>
        )}

        {reportType === 'performance' && (
          <>
            <div className="card-header">
              <h3>📊 Performance Report</h3>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>

            {performanceData?.studentPerformance?.length > 0 ? (
              <>
                <h4 style={{ margin: '1rem 0 0.75rem', color: 'var(--text-secondary)' }}>Student Performance</h4>
                <div className="wdu-table-container">
                  <table className="wdu-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Average Marks</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.studentPerformance.map((s) => {
                        const grade = s.averageMarks >= 90 ? 'A+' : s.averageMarks >= 80 ? 'A' : s.averageMarks >= 70 ? 'B' : s.averageMarks >= 60 ? 'C' : s.averageMarks >= 50 ? 'D' : 'F';
                        const color = s.averageMarks >= 70 ? 'var(--success-light)' : s.averageMarks >= 50 ? 'var(--warning-light)' : 'var(--danger-light)';
                        return (
                          <tr key={s.studentId}>
                            <td>{s.studentId}</td>
                            <td><strong>{s.studentName}</strong></td>
                            <td><strong style={{ color }}>{s.averageMarks}</strong></td>
                            <td><span className="badge" style={{ background: `${color}20`, color }}>{grade}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {performanceData.subjectPerformance?.length > 0 && (
                  <>
                    <h4 style={{ margin: '1.5rem 0 0.75rem', color: 'var(--text-secondary)' }}>Subject-wise Average</h4>
                    <div className="wdu-table-container">
                      <table className="wdu-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Average Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.subjectPerformance.map((s, idx) => (
                            <tr key={idx}>
                              <td><strong>{s.subject}</strong></td>
                              <td>{s.averageMarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="empty-state"><p>No performance data available</p></div>
            )}
          </>
        )}

        {reportType === 'students' && (
          <>
            <div className="card-header">
              <h3>👥 Student Directory</h3>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Total: {students.length} students
              </span>
            </div>

            {students.length > 0 ? (
              <div className="wdu-table-container">
                <table className="wdu-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td><strong>{s.name}</strong></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                        <td>{s.department}</td>
                        <td>{s.year}</td>
                        <td>{s.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state"><p>No students found</p></div>
            )}
          </>
        )}

        {reportType === 'top' && (
          <>
            <div className="card-header">
              <h3>🏆 Top Students Report</h3>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>

            {topStudents.length > 0 ? (
              <div className="wdu-table-container">
                <table className="wdu-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student Name</th>
                      <th>Average Marks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStudents.map((s) => (
                      <tr key={s.studentId}>
                        <td style={{ fontWeight: 700 }}>#{s.rank}</td>
                        <td><strong>{s.studentName}</strong></td>
                        <td><strong style={{ color: 'var(--success-light)' }}>{s.averageMarks}%</strong></td>
                        <td><span className="badge present">Top Performer</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state"><p>No data available</p></div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
