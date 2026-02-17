package com.coaching.platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a student's answer to a question
 */
@Entity
@Table(name = "answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_sheet_id", nullable = false)
    private AnswerSheet answerSheet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    @Column
    private UUID selectedOptionId;

    @ElementCollection
    @CollectionTable(name = "answer_images", joinColumns = @JoinColumn(name = "answer_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Column
    private LocalDateTime answeredAt;

    @Column
    private Integer pointsAwarded;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAutoGraded = false;

    /**
     * Auto-grade for objective questions
     */
    public void autoGrade() {
        if (question.getType() != com.coaching.platform.enums.QuestionType.OBJECTIVE) {
            return;
        }

        Option correctOption = question.getCorrectOption();
        if (correctOption != null && correctOption.getId().equals(selectedOptionId)) {
            this.pointsAwarded = question.getPoints();
            this.feedback = "Correct answer";
        } else {
            this.pointsAwarded = 0;
            this.feedback = "Incorrect answer";
        }
        this.isAutoGraded = true;
    }

    /**
     * Manually grade an answer
     */
    public void grade(int points, String feedbackText) {
        this.pointsAwarded = points;
        this.feedback = feedbackText;
    }
}
