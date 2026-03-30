package com.edutrack.controller;

import com.edutrack.entity.Update;
import com.edutrack.service.UpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/updates")
public class UpdateController {

    @Autowired
    private UpdateService updateService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<Update>> getAllUpdates() {
        return ResponseEntity.ok(updateService.getAllUpdates());
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<Update>> getRecentUpdates(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(updateService.getRecentUpdates(limit));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUpdate(@RequestBody Update update) {
        try {
            Update savedUpdate = updateService.createUpdate(update);
            return ResponseEntity.ok(savedUpdate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUpdate(@PathVariable Long id) {
        try {
            updateService.deleteUpdate(id);
            return ResponseEntity.ok(Map.of("message", "Update deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
