package com.coaching.platform.service;

import com.coaching.platform.dto.PerformanceData;
import com.coaching.platform.dto.PerformanceComparison;
import com.coaching.platform.entity.*;
import com.coaching.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for student performance analytics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceService {

    private final PerformanceMetricsRepository metricsRepository;
    private final AnswerSheetRepository answerSheetRepository;
    private final UserRepository userRepository;
    private final BatchRepository batchRepository;

    /**
     * Get student's performance data (all exams)
     */
    public PerformanceData getStudentPerformance(UUID studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<PerformanceMetrics> metrics = metricsRepository.findByStudentOrderByCalculatedAtDesc(student);

        return PerformanceData.fromMetrics(student, metrics);
    }

    /**
     * Get comparison data (student vs batch average)
     */
    public PerformanceComparison getComparisonData(UUID studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        List<PerformanceMetrics> studentMetrics = metricsRepository.findByStudentOrderByCalculatedAtDesc(student);

        // Get batch averages for each exam
        List<PerformanceComparison.ExamComparison> comparisons = studentMetrics.stream()
                .map(metric -> {
                    UUID batchId = metric.getExam().getBatch().getId();
                    Double batchAvg = metricsRepository.findBatchAverageByExam(batchId, metric.getExam().getId());

                    return new PerformanceComparison.ExamComparison(
                            metric.getExam().getTitle(),
                            metric.getObtainedMarks(),
                            metric.getTotalMarks(),
                            metric.getPercentage(),
                            batchAvg != null ? batchAvg : 0.0);
                })
                .collect(Collectors.toList());

        return new PerformanceComparison(studentMetrics.size(), comparisons);
    }

    /**
     * Calculate and save performance metrics after grading
     */
    @Transactional
    public void calculatePerformanceMetrics(UUID answerSheetId) {
        AnswerSheet answerSheet = answerSheetRepository.findById(answerSheetId)
                .orElseThrow(() -> new IllegalArgumentException("AnswerSheet not found"));

        if (answerSheet.getStatus() != com.coaching.platform.enums.SubmissionStatus.GRADED) {
            return; // Only calculate for graded sheets
        }

        int obtained = answerSheet.getObtainedPoints() != null ? answerSheet.getObtainedPoints() : 0;
        int total = answerSheet.getTotalPoints() != null ? answerSheet.getTotalPoints() : 1;
        double percentage = (obtained * 100.0) / total;

        // Calculate rank
        UUID batchId = answerSheet.getExam().getBatch().getId();
        UUID examId = answerSheet.getExam().getId();
        List<PerformanceMetrics> allMetrics = metricsRepository
                .findByBatchAndExamOrderByPercentageDesc(batchId, examId);
        int rank = (int) allMetrics.stream()
                .filter(m -> m.getPercentage() > percentage)
                .count() + 1;

        // Save or update metrics
        PerformanceMetrics metrics = metricsRepository
                .findByStudentAndExam(answerSheet.getStudent(), answerSheet.getExam())
                .orElse(PerformanceMetrics.builder()
                        .student(answerSheet.getStudent())
                        .exam(answerSheet.getExam())
                        .build());

        metrics.setObtainedMarks(obtained);
        metrics.setTotalMarks(total);
        metrics.setPercentage(percentage);
        metrics.setBatchRank(rank);

        metricsRepository.save(metrics);
        log.info("Calculated performance metrics for student: {} on exam: {}",
                answerSheet.getStudent().getId(), examId);
    }
}
