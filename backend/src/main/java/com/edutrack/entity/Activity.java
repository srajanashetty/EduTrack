package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // attendance, marks, student, announcement

    @Column(nullable = false)
    private String message;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
