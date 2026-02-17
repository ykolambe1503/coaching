package com.coaching.platform.dto;

import lombok.*;

import java.util.List;

/**
 * DTO for student vs batch average comparison
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceComparison {

    private Integer totalExams;
    private List<ExamComparison> exams;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ExamComparison {
        private String examName;
        private Integer studentObtained;
        private Integer totalMarks;
        private Double studentPercentage;
        private Double batchAverage;
    }
}
