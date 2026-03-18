package com.edutrack.repository;

import com.edutrack.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByDepartmentAndYearAndSection(String department, Integer year, String section);
    List<TimetableEntry> findByDay(String day);
}
