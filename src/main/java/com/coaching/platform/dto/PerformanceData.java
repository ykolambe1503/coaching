package com.coaching.platform.dto;

import com.coaching.platform.entity.PerformanceMetrics;
import com.coaching.platform.entity.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for student performance overview
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformanceData {

    private String studentName;
    private Integer totalExams;
    private Double averagePercentage;
    private Integer currentRank;
    private Integer highestScore;
    private List<ExamPerformance> exams;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ExamPerformance {
        private String examName;
        private Integer obtained;
        private Integer total;
        private Double percentage;
        private Integer rank;
    }

    public static PerformanceData fromMetrics(User student, List<PerformanceMetrics> metrics) {
        Double avgPercentage = metrics.stream()
                .mapToDouble(PerformanceMetrics::getPercentage)
                .average()
                .orElse(0.0);

        Integer highestScore = metrics.stream()
                .mapToInt(PerformanceMetrics::getObtainedMarks)
                .max()
                .orElse(0);

        List<ExamPerformance> exams = metrics.stream()
                .map(m -> new ExamPerformance(
                        m.getExam().getTitle(),
                        m.getObtainedMarks(),
                        m.getTotalMarks(),
                        m.getPercentage(),
                        m.getBatchRank()))
                .collect(Collectors.toList());

        return PerformanceData.builder()
                .studentName(student.getFirstName() + " " + student.getLastName())
                .totalExams(metrics.size())
                .averagePercentage(avgPercentage)
                .highestScore(highestScore)
                .exams(exams)
                .build();
    }
}
