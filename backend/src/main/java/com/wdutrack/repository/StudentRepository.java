package com.wdutrack.repository;

import com.wdutrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findByDepartment(String department);
    List<Student> findByYear(Integer year);
    List<Student> findByDepartmentAndYearAndSection(String department, Integer year, String section);
}
