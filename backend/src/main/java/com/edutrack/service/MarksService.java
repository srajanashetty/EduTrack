package com.edutrack.service;

import com.edutrack.dto.MarksRequest;
import com.edutrack.entity.Marks;
import com.edutrack.entity.Student;
import com.edutrack.repository.MarksRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityService activityService;

    public Marks addMarks(MarksRequest request) {
        if (marksRepository.existsByStudentIdAndSubject(request.getStudentId(), request.getSubject())) {
            // Update marks if already exists or throw error. Let's throw for "no duplicates added"
            throw new RuntimeException("Marks already exist for student ID: " + request.getStudentId() + " in subject: " + request.getSubject());
        }

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException(
                        "Student not found with id: " + request.getStudentId()));

        Marks marks = Marks.builder()
                .student(student)
                .subject(request.getSubject())
                .marks(request.getMarks())
                .build();

        return marksRepository.save(marks);
    }

    public List<Marks> addBulkMarks(List<MarksRequest> requests) {
        List<Marks> saved = requests.stream()
                .map(this::addMarks)
                .toList();
        if (!saved.isEmpty()) {
            activityService.log("marks", "Uploaded markers for " + saved.size() + " records in " + requests.get(0).getSubject());
        }
        return saved;
    }

    public List<Marks> getMarksByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }
}
