package com.edutrack.repository;

import com.edutrack.entity.Student;
import com.edutrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    List<Student> findBySection(String section);
    Optional<Student> findByUser(User user);
    List<Student> findByDepartment(String department);
    List<Student> findByYear(Integer year);
    List<Student> findByDepartmentAndYearAndSection(String department, Integer year, String section);
}
