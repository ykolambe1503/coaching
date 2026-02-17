package com.coaching.platform.repository;

import com.coaching.platform.entity.Exam;
import com.coaching.platform.entity.PerformanceMetrics;
import com.coaching.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerformanceMetricsRepository extends JpaRepository<PerformanceMetrics, UUID> {

    List<PerformanceMetrics> findByStudentOrderByCalculatedAtDesc(User student);

    Optional<PerformanceMetrics> findByStudentAndExam(User student, Exam exam);

    @Query("SELECT AVG(pm.percentage) FROM PerformanceMetrics pm WHERE pm.exam.batch.id = :batchId AND pm.exam.id = :examId")
    Double findBatchAverageByExam(@Param("batchId") UUID batchId, @Param("examId") UUID examId);

    @Query("SELECT pm FROM PerformanceMetrics pm WHERE pm.exam.batch.id = :batchId AND pm.exam.id = :examId ORDER BY pm.percentage DESC")
    List<PerformanceMetrics> findByBatchAndExamOrderByPercentageDesc(@Param("batchId") UUID batchId,
            @Param("examId") UUID examId);
}
