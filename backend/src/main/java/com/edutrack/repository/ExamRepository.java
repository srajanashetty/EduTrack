package com.edutrack.repository;

import com.edutrack.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByExamDate(LocalDate date);
    List<Exam> findByDepartmentAndYearAndSection(String department, Integer year, String section);
}
