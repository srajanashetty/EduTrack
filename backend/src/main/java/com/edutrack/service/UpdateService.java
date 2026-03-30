package com.edutrack.service;

import com.edutrack.entity.Update;
import com.edutrack.repository.UpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UpdateService {

    @Autowired
    private UpdateRepository updateRepository;

    public List<Update> getAllUpdates() {
        return updateRepository.findLatestUpdates();
    }

    public List<Update> getRecentUpdates(int limit) {
        return updateRepository.findLatestUpdates().stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Update createUpdate(Update update) {
        update.setCreatedAt(LocalDateTime.now());
        return updateRepository.save(update);
    }

    public void deleteUpdate(Long id) {
        updateRepository.deleteById(id);
    }
}
