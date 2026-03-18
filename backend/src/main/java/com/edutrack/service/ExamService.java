package com.edutrack.service;

import com.edutrack.dto.ExamDTO;
import com.edutrack.entity.Exam;
import com.edutrack.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public List<Exam> getExamsByClass(String department, Integer year, String section) {
        return examRepository.findByDepartmentAndYearAndSection(department, year, section);
    }

    public Exam createExam(ExamDTO dto) {
        Exam exam = Exam.builder()
                .subject(dto.getSubject())
                .examDate(dto.getExamDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .location(dto.getLocation())
                .department(dto.getDepartment())
                .year(dto.getYear())
                .section(dto.getSection())
                .build();
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }
}
