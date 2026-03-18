package com.edutrack.controller;

import com.edutrack.dto.TimetableDTO;
import com.edutrack.entity.TimetableEntry;
import com.edutrack.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/timetable")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<TimetableEntry> getAll() {
        return timetableService.getAllTimetable();
    }

    @GetMapping("/class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public List<TimetableEntry> getByClass(
            @RequestParam String department,
            @RequestParam Integer year,
            @RequestParam String section) {
        return timetableService.getTimetableByClass(department, year, section);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<TimetableEntry> create(@RequestBody TimetableDTO dto) {
        return ResponseEntity.ok(timetableService.createTimetableEntry(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<TimetableEntry> update(@PathVariable Long id, @RequestBody TimetableDTO dto) {
        return ResponseEntity.ok(timetableService.updateTimetableEntry(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timetableService.deleteTimetableEntry(id);
        return ResponseEntity.ok().build();
    }
}
