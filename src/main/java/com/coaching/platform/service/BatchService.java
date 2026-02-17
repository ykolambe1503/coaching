package com.coaching.platform.service;

import com.coaching.platform.dto.BatchRequest;
import com.coaching.platform.dto.BatchResponse;
import com.coaching.platform.entity.Batch;
import com.coaching.platform.entity.User;
import com.coaching.platform.enums.Role;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.BatchRepository;
import com.coaching.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BatchService {

    private final BatchRepository batchRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public BatchResponse createBatch(BatchRequest request) {
        User currentUser = getCurrentUser();

        // Only ADMIN can create batches
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can create batches");
        }

        log.info("Creating new batch: {}", request.getName());

        Batch batch = Batch.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(currentUser)
                .build();

        batch = batchRepository.save(batch);
        log.info("Batch created successfully with ID: {}", batch.getId());

        return convertToResponse(batch);
    }

    public List<BatchResponse> getAllBatches() {
        User currentUser = getCurrentUser();
        List<Batch> batches;

        // Filter batches based on role
        if (currentUser.getRole() == Role.ADMIN) {
            batches = batchRepository.findAll();
        } else if (currentUser.getRole() == Role.FACULTY) {
            batches = batchRepository.findByFacultyContaining(currentUser);
        } else { // STUDENT
            batches = batchRepository.findByStudentsContaining(currentUser);
        }

        return batches.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BatchResponse getBatchById(UUID batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        User currentUser = getCurrentUser();

        // Check if user has access to this batch
        if (currentUser.getRole() != Role.ADMIN &&
                !batch.getStudents().contains(currentUser) &&
                !batch.getFaculty().contains(currentUser)) {
            throw new UnauthorizedException("You do not have access to this batch");
        }

        return convertToResponse(batch);
    }

    @Transactional
    public BatchResponse updateBatch(UUID batchId, BatchRequest request) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can update batches");
        }

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        batch.setName(request.getName());
        batch.setDescription(request.getDescription());
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());

        batch = batchRepository.save(batch);
        log.info("Batch updated successfully: {}", batch.getId());

        return convertToResponse(batch);
    }

    @Transactional
    public void deleteBatch(UUID batchId) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can delete batches");
        }

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        batchRepository.delete(batch);
        log.info("Batch deleted successfully: {}", batchId);
    }

    @Transactional
    public BatchResponse assignStudents(UUID batchId, Set<UUID> studentIds) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can assign students");
        }

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        Set<User> students = studentIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id)))
                .filter(user -> user.getRole() == Role.STUDENT)
                .collect(Collectors.toSet());

        batch.getStudents().addAll(students);
        batch = batchRepository.save(batch);

        log.info("Assigned {} students to batch {}", students.size(), batchId);

        return convertToResponse(batch);
    }

    @Transactional
    public BatchResponse assignFaculty(UUID batchId, Set<UUID> facultyIds) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN users can assign faculty");
        }

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        Set<User> faculty = facultyIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id)))
                .filter(user -> user.getRole() == Role.FACULTY)
                .collect(Collectors.toSet());

        batch.getFaculty().addAll(faculty);
        batch = batchRepository.save(batch);

        log.info("Assigned {} faculty to batch {}", faculty.size(), batchId);

        return convertToResponse(batch);
    }

    private BatchResponse convertToResponse(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .name(batch.getName())
                .description(batch.getDescription())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .createdBy(convertToUserSummary(batch.getCreatedBy()))
                .students(batch.getStudents().stream()
                        .map(this::convertToUserSummary)
                        .collect(Collectors.toSet()))
                .faculty(batch.getFaculty().stream()
                        .map(this::convertToUserSummary)
                        .collect(Collectors.toSet()))
                .createdAt(batch.getCreatedAt())
                .updatedAt(batch.getUpdatedAt())
                .build();
    }

    private BatchResponse.UserSummary convertToUserSummary(User user) {
        return BatchResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}
