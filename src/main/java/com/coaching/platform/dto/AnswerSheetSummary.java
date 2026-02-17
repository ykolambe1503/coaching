package com.coaching.platform.dto;

import com.coaching.platform.enums.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSheetSummary {

    private UUID id;
    private String examTitle;
    private UUID examId;
    private String studentName;
    private String studentEmail;
    private UUID studentId;
    private LocalDateTime submittedAt;
    private SubmissionStatus status;
    private Integer totalPoints;
    private Integer obtainedPoints;
}
