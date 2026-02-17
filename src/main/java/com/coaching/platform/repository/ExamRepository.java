package com.coaching.platform.repository;

import com.coaching.platform.entity.Exam;
import com.coaching.platform.enums.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {

    List<Exam> findByCreatedBy_Id(UUID facultyId);

    List<Exam> findByCreatedBy_IdAndStatus(UUID facultyId, ExamStatus status);

    List<Exam> findByBatch_IdAndStatus(UUID batchId, ExamStatus status);

    List<Exam> findByBatchAndStatus(com.coaching.platform.entity.Batch batch, ExamStatus status);

    List<Exam> findByOrganization_OrgId(UUID orgId);
}
