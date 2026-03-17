package com.edutrack.repository;

import com.edutrack.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    Long countPresentDays(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    Long countTotalDays(@Param("studentId") Long studentId);

    @Query("SELECT a.student.id, a.student.name, " +
           "COUNT(a), " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) " +
           "FROM Attendance a GROUP BY a.student.id, a.student.name")
    List<Object[]> getAttendanceSummaryForAllStudents();

    @Query("SELECT a.student.id, a.student.name, " +
           "COUNT(a), " +
           "SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) " +
           "FROM Attendance a GROUP BY a.student.id, a.student.name " +
           "HAVING (SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) * 100.0 / COUNT(a)) < 75")
    List<Object[]> getStudentsWithLowAttendance();
}
