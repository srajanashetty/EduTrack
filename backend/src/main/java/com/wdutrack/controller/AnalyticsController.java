package com.wdutrack.controller;

import com.wdutrack.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/attendance")
    public ResponseEntity<Map<String, Object>> getAttendanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getAttendanceAnalytics());
    }

    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getPerformanceAnalytics());
    }

    @GetMapping("/top-students")
    public ResponseEntity<List<Map<String, Object>>> getTopStudents() {
        return ResponseEntity.ok(analyticsService.getTopStudents());
    }

    @GetMapping("/low-attendance")
    public ResponseEntity<List<Map<String, Object>>> getLowAttendanceStudents() {
        return ResponseEntity.ok(analyticsService.getLowAttendanceStudents());
    }
}
