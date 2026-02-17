package com.coaching.platform.controller;

import com.coaching.platform.dto.*;
import com.coaching.platform.security.OrgContext;
import com.coaching.platform.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for organization admin user management
 * All operations are scoped to the organization specified in X-Organization-Id
 * header
 */
@RestController
@RequestMapping("/api/v1/org-admin/users")
@RequiredArgsConstructor
@Slf4j
public class UserManagementController {

    private final UserManagementService userManagementService;

    /**
     * Get all faculty in the organization
     */
    @GetMapping("/faculty")
    public ResponseEntity<List<UserResponse>> getFaculty() {
        UUID orgId = OrgContext.getOrgId();
        log.info("GET /api/v1/org-admin/users/faculty for org: {}", orgId);
        List<UserResponse> faculty = userManagementService.getFacultyInOrg(orgId);
        return ResponseEntity.ok(faculty);
    }

    /**
     * Get all students in the organization
     */
    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getStudents() {
        UUID orgId = OrgContext.getOrgId();
        log.info("GET /api/v1/org-admin/users/students for org: {}", orgId);
        List<UserResponse> students = userManagementService.getStudentsInOrg(orgId);
        return ResponseEntity.ok(students);
    }

    /**
     * Create a new user in the organization
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UUID orgId = OrgContext.getOrgId();
        log.info("POST /api/v1/org-admin/users for org: {}", orgId);
        UserResponse user = userManagementService.createUser(request, orgId);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Get user profile by ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable UUID userId) {
        UUID orgId = OrgContext.getOrgId();
        log.info("GET /api/v1/org-admin/users/{} for org: {}", userId, orgId);
        UserResponse user = userManagementService.getUserProfile(userId, orgId);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user information
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRequest request) {
        UUID orgId = OrgContext.getOrgId();
        log.info("PUT /api/v1/org-admin/users/{} for org: {}", userId, orgId);
        UserResponse user = userManagementService.updateUser(userId, request, orgId);
        return ResponseEntity.ok(user);
    }

    /**
     * Delete user (soft delete)
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID userId) {
        UUID orgId = OrgContext.getOrgId();
        log.info("DELETE /api/v1/org-admin/users/{} for org: {}", userId, orgId);
        userManagementService.deleteUser(userId, orgId);
        return ResponseEntity.noContent().build();
    }
}
