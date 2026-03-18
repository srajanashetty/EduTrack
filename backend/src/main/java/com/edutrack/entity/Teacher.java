package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teacher_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String department;

    private String subjectsHandled;

    private String experience;

    @Column(nullable = false)
    private String teacherId;
}
