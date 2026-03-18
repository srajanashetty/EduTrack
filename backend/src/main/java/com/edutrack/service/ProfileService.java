package com.edutrack.service;

import com.edutrack.dto.ProfileResponse;
import com.edutrack.entity.Role;
import com.edutrack.entity.Student;
import com.edutrack.entity.Teacher;
import com.edutrack.entity.User;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import com.edutrack.repository.UserRepository;
import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.MarksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .name(user.getFullName())
                .email(user.getUsername())
                .role(user.getRole())
                .phoneNumber(user.getPhoneNumber())
                .profileImage(user.getProfileImage());

        if (user.getRole() == Role.STUDENT) {
            studentRepository.findByUser(user).ifPresent(student -> {
                builder.name(student.getName());
                builder.studentId(student.getId());
                builder.department(student.getDepartment());
                builder.year(student.getYear());
                builder.section(student.getSection());
                
                // Fetch derived stats
                Long total = attendanceRepository.countTotalDays(student.getId());
                Long present = attendanceRepository.countPresentDays(student.getId());
                double attendance = total > 0 ? (present * 100.0 / total) : 0;
                builder.attendancePercentage(Math.round(attendance * 100.0) / 100.0);

                Double avgMarks = marksRepository.getAverageMarksForStudent(student.getId());
                builder.gpa(avgMarks != null ? Math.round(avgMarks * 10.0) / 100.0 : 0.0); // Simple GPA conversion
            });
        } else if (user.getRole() == Role.TEACHER) {
            teacherRepository.findByUser(user).ifPresent(teacher -> {
                builder.name(teacher.getName());
                builder.teacherId(teacher.getTeacherId());
                builder.teacherDepartment(teacher.getDepartment());
                builder.experience(teacher.getExperience());
                if (teacher.getSubjectsHandled() != null) {
                    builder.subjectsHandled(Arrays.asList(teacher.getSubjectsHandled().split(",")));
                }
            });
        }

        return builder.build();
    }

    public ProfileResponse updateProfile(String username, ProfileResponse request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        userRepository.save(user);

        // Also update sub-entities if applicable
        if (user.getRole() == Role.STUDENT) {
            studentRepository.findByUser(user).ifPresent(student -> {
                student.setName(request.getName());
                studentRepository.save(student);
            });
        } else if (user.getRole() == Role.TEACHER) {
            teacherRepository.findByUser(user).ifPresent(teacher -> {
                teacher.setName(request.getName());
                teacherRepository.save(teacher);
            });
        }

        return getProfile(username);
    }
}
