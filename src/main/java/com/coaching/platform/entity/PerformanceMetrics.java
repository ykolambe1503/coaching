package com.coaching.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity storing performance metrics for students
 */
@Entity
@Table(name = "performance_metrics")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(nullable = false)
    private Integer obtainedMarks;

    @Column(nullable = false)
    private Integer totalMarks;

    @Column(nullable = false)
    private Double percentage;

    @Column
    private Integer batchRank;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime calculatedAt;
}
