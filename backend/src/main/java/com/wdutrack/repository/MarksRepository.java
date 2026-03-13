package com.wdutrack.repository;

import com.wdutrack.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

    List<Marks> findByStudentId(Long studentId);

    @Query("SELECT m.student.id, m.student.name, AVG(m.marks) " +
           "FROM Marks m GROUP BY m.student.id, m.student.name " +
           "ORDER BY AVG(m.marks) DESC")
    List<Object[]> getAverageMarksPerStudent();

    @Query("SELECT m.student.id, m.student.name, AVG(m.marks) " +
           "FROM Marks m GROUP BY m.student.id, m.student.name " +
           "ORDER BY AVG(m.marks) DESC LIMIT 10")
    List<Object[]> getTopStudentsByMarks();

    @Query("SELECT m.subject, AVG(m.marks) FROM Marks m GROUP BY m.subject")
    List<Object[]> getAverageMarksBySubject();
}
