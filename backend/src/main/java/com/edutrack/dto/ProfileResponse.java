package com.edutrack.dto;

import com.edutrack.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    // Common fields
    private String name;
    private String email;
    private Role role;
    private String phoneNumber;
    private String profileImage;

    // Student specific
    private Long studentId;
    private String department;
    private Integer year;
    private String section;
    private Double gpa;
    private Double attendancePercentage;

    // Teacher specific
    private String teacherId;
    private List<String> subjectsHandled;
    private String experience;
    private String teacherDepartment;
}
