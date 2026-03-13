package com.wdutrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarksRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Marks are required")
    private Double marks;
}
