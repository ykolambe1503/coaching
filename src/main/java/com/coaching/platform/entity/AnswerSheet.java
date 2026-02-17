package com.coaching.platform.entity;

import com.coaching.platform.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a student's answer sheet for an exam
 */
@Entity
@Table(name = "answer_sheets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime expiresAt;

    @Column
    private LocalDateTime submittedAt;

    @Column
    private LocalDateTime gradedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.IN_PROGRESS;

    @Column
    private Integer totalPoints;

    @Column
    private Integer obtainedPoints;

    @Column(columnDefinition = "TEXT")
    private String overallFeedback;

    @OneToMany(mappedBy = "answerSheet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Answer> answers = new ArrayList<>();

    /**
     * Submit the answer sheet
     */
    public void submit() {
        this.status = SubmissionStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();
    }

    /**
     * Mark as graded
     */
    public void markAsGraded() {
        this.status = SubmissionStatus.GRADED;
        this.gradedAt = LocalDateTime.now();
    }

    /**
     * Calculate total obtained points from all answers
     */
    public void calculateObtainedPoints() {
        this.obtainedPoints = answers.stream()
                .mapToInt(answer -> answer.getPointsAwarded() != null ? answer.getPointsAwarded() : 0)
                .sum();
    }

    /**
     * Check if all answers are graded
     */
    public boolean isFullyGraded() {
        return answers.stream()
                .allMatch(answer -> answer.getPointsAwarded() != null);
    }
}
