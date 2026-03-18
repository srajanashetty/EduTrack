package com.edutrack.dto;

import lombok.Data;

@Data
public class TimetableDTO {
    private String day;
    private String subject;
    private String startTime;
    private String endTime;
    private String teacherName;
    private String room;
    private String department;
    private Integer year;
    private String section;
}
