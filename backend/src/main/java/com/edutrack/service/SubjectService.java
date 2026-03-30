package com.edutrack.service;

import com.edutrack.entity.Subject;
import com.edutrack.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getSubjectsBySection(String section) {
        if (section == null || section.isEmpty() || section.equalsIgnoreCase("All")) {
            return subjectRepository.findAll();
        }
        return subjectRepository.findBySection(section);
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
