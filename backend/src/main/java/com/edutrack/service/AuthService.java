package com.edutrack.service;

import com.edutrack.config.JwtUtil;
import com.edutrack.dto.LoginRequest;
import com.edutrack.dto.LoginResponse;
import com.edutrack.dto.RegisterRequest;
import com.edutrack.entity.Role;
import com.edutrack.entity.Student;
import com.edutrack.entity.User;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Resolve the linked Student row for a STUDENT-role user.
     * Convention: username == student email.
     */
    private Long resolveStudentId(User user) {
        if (user.getRole() != Role.STUDENT) return null;
        Optional<Student> student = studentRepository.findByEmail(user.getUsername());
        return student.map(Student::getId).orElse(null);
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .studentId(resolveStudentId(user))
                .message("Login successful")
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .build();

        userRepository.save(user);

        // If STUDENT, also create a Student record
        if (user.getRole() == Role.STUDENT) {
            Student student = Student.builder()
                    .name(request.getName() != null ? request.getName() : request.getUsername())
                    .email(request.getUsername())
                    .department(request.getDepartment() != null ? request.getDepartment() : "General")
                    .year(request.getYear() != null ? request.getYear() : 1)
                    .section(request.getSection() != null ? request.getSection() : "A")
                    .build();
            studentRepository.save(student);
        }

        String token = jwtUtil.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .studentId(resolveStudentId(user))
                .message("Registration successful")
                .build();
    }
}
