package com.coaching.platform.service;

import com.coaching.platform.dto.BatchSummary;
import com.coaching.platform.entity.Batch;
import com.coaching.platform.entity.User;
import com.coaching.platform.repository.BatchRepository;
import com.coaching.platform.repository.ExamRepository;
import com.coaching.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacultyBatchService {

    private final BatchRepository batchRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public List<BatchSummary> getFacultyBatches(UUID facultyId) {
        log.info("Fetching batches for faculty: {}", facultyId);

        // Get all batches in the faculty's organization
        User faculty = userRepository.findById(facultyId).orElseThrow();
        List<Batch> batches = batchRepository.findByOrganization_OrgId(faculty.getOrganization().getOrgId());

        return batches.stream()
                .map(this::convertToSummary)
                .collect(Collectors.toList());
    }

    private BatchSummary convertToSummary(Batch batch) {
        // Count students in batch
        int studentCount = batch.getStudents() != null ? batch.getStudents().size() : 0;

        // Count exams for this batch
        int examCount = (int) examRepository.findByBatch_IdAndStatus(
                batch.getId(),
                com.coaching.platform.enums.ExamStatus.PUBLISHED).size();

        return BatchSummary.builder()
                .id(batch.getId())
                .name(batch.getName())
                .studentCount(studentCount)
                .examCount(examCount)
                .build();
    }
}
