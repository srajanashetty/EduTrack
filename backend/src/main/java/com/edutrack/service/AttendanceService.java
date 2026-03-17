package com.edutrack.service;

import com.edutrack.dto.AttendanceRequest;
import com.edutrack.entity.Attendance;
import com.edutrack.entity.Student;
import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Attendance markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException(
                        "Student not found with id: " + request.getStudentId()));

        Attendance attendance = Attendance.builder()
                .student(student)
                .date(request.getDate())
                .status(request.getStatus().toUpperCase())
                .build();

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> markBulkAttendance(List<AttendanceRequest> requests) {
        return requests.stream()
                .map(this::markAttendance)
                .toList();
    }

    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getClassAttendance() {
        return attendanceRepository.findAll();
    }

    public Map<String, Object> getStudentAttendanceStats(Long studentId) {
        Long totalDays = attendanceRepository.countTotalDays(studentId);
        Long presentDays = attendanceRepository.countPresentDays(studentId);
        double percentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("studentId", studentId);
        stats.put("totalDays", totalDays);
        stats.put("presentDays", presentDays);
        stats.put("absentDays", totalDays - presentDays);
        stats.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);

        return stats;
    }
}
