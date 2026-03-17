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

    public Marks addMarks(MarksRequest request) {
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
        return requests.stream()
                .map(this::addMarks)
                .toList();
    }

    public List<Marks> getMarksByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }
}
