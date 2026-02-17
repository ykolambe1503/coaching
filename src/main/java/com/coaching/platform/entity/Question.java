package com.coaching.platform.entity;

import com.coaching.platform.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing a question in an exam
 */
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private Integer orderNumber;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderNumber ASC")
    @Builder.Default
    private List<Option> options = new ArrayList<>();

    /**
     * Add an option to this question
     */
    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }

    /**
     * Get the correct option for objective questions
     */
    public Option getCorrectOption() {
        if (type != QuestionType.OBJECTIVE) {
            return null;
        }
        return options.stream()
                .filter(Option::getIsCorrect)
                .findFirst()
                .orElse(null);
    }
}
