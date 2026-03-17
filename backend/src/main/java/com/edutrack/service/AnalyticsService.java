package com.edutrack.service;

import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.MarksRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Map<String, Object> getAttendanceAnalytics() {
        List<Object[]> summaries = attendanceRepository.getAttendanceSummaryForAllStudents();
        List<Map<String, Object>> data = new ArrayList<>();
        long totalPresent = 0;
        long totalAbsent = 0;

        for (Object[] row : summaries) {
            Map<String, Object> entry = new HashMap<>();
            Long studentId = (Long) row[0];
            String studentName = (String) row[1];
            Long total = (Long) row[2];
            Long present = (Long) row[3];
            double percentage = total > 0 ? (present * 100.0 / total) : 0;

            entry.put("studentId", studentId);
            entry.put("studentName", studentName);
            entry.put("totalDays", total);
            entry.put("presentDays", present);
            entry.put("absentDays", total - present);
            entry.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);
            data.add(entry);

            totalPresent += present;
            totalAbsent += (total - present);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("students", data);
        result.put("totalStudents", data.size());
        result.put("overallPresent", totalPresent);
        result.put("overallAbsent", totalAbsent);
        return result;
    }

    public Map<String, Object> getPerformanceAnalytics() {
        List<Object[]> avgMarks = marksRepository.getAverageMarksPerStudent();
        List<Object[]> subjectAvg = marksRepository.getAverageMarksBySubject();

        List<Map<String, Object>> studentPerformance = new ArrayList<>();
        for (Object[] row : avgMarks) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("studentId", row[0]);
            entry.put("studentName", row[1]);
            entry.put("averageMarks", Math.round((Double) row[2] * 100.0) / 100.0);
            studentPerformance.add(entry);
        }

        List<Map<String, Object>> subjectPerformance = new ArrayList<>();
        for (Object[] row : subjectAvg) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("subject", row[0]);
            entry.put("averageMarks", Math.round((Double) row[1] * 100.0) / 100.0);
            subjectPerformance.add(entry);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("studentPerformance", studentPerformance);
        result.put("subjectPerformance", subjectPerformance);
        return result;
    }

    public List<Map<String, Object>> getTopStudents() {
        List<Object[]> topStudents = marksRepository.getTopStudentsByMarks();
        List<Map<String, Object>> data = new ArrayList<>();
        int rank = 1;

        for (Object[] row : topStudents) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank++);
            entry.put("studentId", row[0]);
            entry.put("studentName", row[1]);
            entry.put("averageMarks", Math.round((Double) row[2] * 100.0) / 100.0);
            data.add(entry);
        }
        return data;
    }

    public List<Map<String, Object>> getLowAttendanceStudents() {
        List<Object[]> lowAttendance = attendanceRepository.getStudentsWithLowAttendance();
        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : lowAttendance) {
            Map<String, Object> entry = new HashMap<>();
            Long studentId = (Long) row[0];
            String studentName = (String) row[1];
            Long total = (Long) row[2];
            Long present = (Long) row[3];
            double percentage = total > 0 ? (present * 100.0 / total) : 0;

            entry.put("studentId", studentId);
            entry.put("studentName", studentName);
            entry.put("totalDays", total);
            entry.put("presentDays", present);
            entry.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);
            data.add(entry);
        }
        return data;
    }
}
