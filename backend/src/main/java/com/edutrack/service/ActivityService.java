package com.edutrack.service;

import com.edutrack.entity.Activity;
import com.edutrack.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public void log(String type, String message) {
        Activity activity = Activity.builder()
                .type(type)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        activityRepository.save(activity);
    }

    public List<Activity> getRecent() {
        return activityRepository.findTop10ByOrderByTimestampDesc();
    }
}
