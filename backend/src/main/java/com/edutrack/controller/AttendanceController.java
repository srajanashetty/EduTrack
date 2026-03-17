package com.edutrack.controller;

import com.edutrack.dto.AttendanceRequest;
import com.edutrack.entity.Attendance;
import com.edutrack.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        try {
            Attendance attendance = attendanceService.markAttendance(request);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mark/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<?> markBulkAttendance(@RequestBody List<@Valid AttendanceRequest> requests) {
        try {
            List<Attendance> attendances = attendanceService.markBulkAttendance(requests);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/student/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentId(id));
    }

    @GetMapping("/student/{id}/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Map<String, Object>> getStudentStats(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceStats(id));
    }

    @GetMapping("/class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Attendance>> getClassAttendance() {
        return ResponseEntity.ok(attendanceService.getClassAttendance());
    }
}
