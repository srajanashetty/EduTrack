package com.edutrack.service;

import com.edutrack.dto.TimetableDTO;
import com.edutrack.entity.TimetableEntry;
import com.edutrack.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    public List<TimetableEntry> getTimetableByClass(String department, Integer year, String section) {
        return timetableRepository.findByDepartmentAndYearAndSection(department, year, section);
    }

    public List<TimetableEntry> getAllTimetable() {
        return timetableRepository.findAll();
    }

    public TimetableEntry createTimetableEntry(TimetableDTO dto) {
        TimetableEntry entry = TimetableEntry.builder()
                .day(dto.getDay())
                .subject(dto.getSubject())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .teacherName(dto.getTeacherName())
                .room(dto.getRoom())
                .department(dto.getDepartment())
                .year(dto.getYear())
                .section(dto.getSection())
                .build();
        return timetableRepository.save(entry);
    }

    public TimetableEntry updateTimetableEntry(Long id, TimetableDTO dto) {
        TimetableEntry entry = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable entry not found"));
        
        entry.setDay(dto.getDay());
        entry.setSubject(dto.getSubject());
        entry.setStartTime(dto.getStartTime());
        entry.setEndTime(dto.getEndTime());
        entry.setTeacherName(dto.getTeacherName());
        entry.setRoom(dto.getRoom());
        entry.setDepartment(dto.getDepartment());
        entry.setYear(dto.getYear());
        entry.setSection(dto.getSection());
        
        return timetableRepository.save(entry);
    }

    public void deleteTimetableEntry(Long id) {
        timetableRepository.deleteById(id);
    }
}
