package com.edutrack.service;

import com.edutrack.dto.StudentDTO;
import com.edutrack.entity.Student;
import com.edutrack.entity.User;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student createStudent(StudentDTO dto) {
        if (studentRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Student with this email already exists: " + dto.getEmail());
        }
        Student student = Student.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .year(dto.getYear())
                .section(dto.getSection())
                .build();
        Student saved = studentRepository.save(student);
        activityService.log("student", "New student enrolled: " + saved.getName() + " in " + saved.getDepartment());

        // Auto-create user login for student if not exists
        if (!userRepository.existsByUsername(dto.getEmail())) {
            User user = User.builder()
                    .username(dto.getEmail())
                    .password(passwordEncoder.encode("Password@123")) // Default password
                    .role(com.edutrack.entity.Role.STUDENT)
                    .build();
            userRepository.save(user);
        }
        return saved;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student updateStudent(Long id, StudentDTO dto) {
        Student student = getStudentById(id);
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setSection(dto.getSection());
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found with email: " + email));
    }
}

