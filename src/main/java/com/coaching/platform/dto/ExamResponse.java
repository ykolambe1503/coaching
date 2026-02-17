package com.coaching.platform.dto;

import com.coaching.platform.enums.ExamStatus;
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
public class ExamResponse {

    private UUID id;
    private String title;
    private String instructions;
    private Integer durationMinutes;
    private ExamStatus status;
    private String batchName;
    private UUID batchId;
    private Integer questionCount;
    private Integer totalPoints;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
}
