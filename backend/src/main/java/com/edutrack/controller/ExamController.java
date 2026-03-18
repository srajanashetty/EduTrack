package com.edutrack.controller;

import com.edutrack.dto.ExamDTO;
import com.edutrack.entity.Exam;
import com.edutrack.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<Exam> getAll() {
        return examService.getAllExams();
    }

    @GetMapping("/class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<Exam> getByClass(
            @RequestParam String department,
            @RequestParam Integer year,
            @RequestParam String section) {
        return examService.getExamsByClass(department, year, section);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Exam> create(@RequestBody ExamDTO dto) {
        return ResponseEntity.ok(examService.createExam(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.ok().build();
    }
}
