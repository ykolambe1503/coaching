package com.coaching.platform.repository;

import com.coaching.platform.entity.AnswerSheet;
import com.coaching.platform.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnswerSheetRepository extends JpaRepository<AnswerSheet, UUID> {

    List<AnswerSheet> findByStudent_Id(UUID studentId);

    List<AnswerSheet> findByExam_Id(UUID examId);

    Optional<AnswerSheet> findByExam_IdAndStudent_Id(UUID examId, UUID studentId);

    List<AnswerSheet> findByExam_IdAndStatus(UUID examId, SubmissionStatus status);

    @Query("SELECT a FROM AnswerSheet a WHERE a.exam.createdBy.id = :facultyId AND a.status = :status")
    List<AnswerSheet> findByFacultyAndStatus(@Param("facultyId") UUID facultyId,
            @Param("status") SubmissionStatus status);

    @Query("SELECT a FROM AnswerSheet a WHERE a.exam.createdBy.id = :facultyId")
    List<AnswerSheet> findByFaculty(@Param("facultyId") UUID facultyId);

    List<AnswerSheet> findByExamAndStudent(com.coaching.platform.entity.Exam exam,
            com.coaching.platform.entity.User student);

    List<AnswerSheet> findByStudentAndStatus(com.coaching.platform.entity.User student, SubmissionStatus status);

    List<AnswerSheet> findByStatusAndExpiresAtBefore(SubmissionStatus status, LocalDateTime expiresAt);
}
