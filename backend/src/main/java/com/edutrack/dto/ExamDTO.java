package com.edutrack.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExamDTO {
    private String subject;
    private LocalDate examDate;
    private String startTime;
    private String endTime;
    private String location;
    private String department;
    private Integer year;
    private String section;
}
