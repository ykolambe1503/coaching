package com.coaching.platform.controller;

import com.coaching.platform.dto.BatchRequest;
import com.coaching.platform.dto.BatchResponse;
import com.coaching.platform.service.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BatchController {

    private final BatchService batchService;

    @PostMapping
    public ResponseEntity<BatchResponse> createBatch(@Valid @RequestBody BatchRequest request) {
        BatchResponse response = batchService.createBatch(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BatchResponse>> getAllBatches() {
        List<BatchResponse> batches = batchService.getAllBatches();
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchResponse> getBatchById(@PathVariable UUID id) {
        BatchResponse response = batchService.getBatchById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BatchResponse> updateBatch(
            @PathVariable UUID id,
            @Valid @RequestBody BatchRequest request) {
        BatchResponse response = batchService.updateBatch(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable UUID id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-students")
    public ResponseEntity<BatchResponse> assignStudents(
            @PathVariable UUID id,
            @RequestBody Set<UUID> studentIds) {
        BatchResponse response = batchService.assignStudents(id, studentIds);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/assign-faculty")
    public ResponseEntity<BatchResponse> assignFaculty(
            @PathVariable UUID id,
            @RequestBody Set<UUID> facultyIds) {
        BatchResponse response = batchService.assignFaculty(id, facultyIds);
        return ResponseEntity.ok(response);
    }
}
