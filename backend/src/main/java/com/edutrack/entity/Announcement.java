package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    private String postedBy;   // username of poster

    @Column(nullable = false)
    private String postedByRole; // ADMIN or TEACHER

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String priority; // HIGH, MEDIUM, LOW

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
