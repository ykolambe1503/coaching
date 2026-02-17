package com.coaching.platform.controller;

import com.coaching.platform.dto.OrganizationDetailResponse;
import com.coaching.platform.dto.OrganizationRequest;
import com.coaching.platform.dto.OrganizationResponse;
import com.coaching.platform.dto.UpdateStatusRequest;
import com.coaching.platform.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for organization management
 * Only accessible by SUPER_ADMIN users
 */
@RestController
@RequestMapping("/api/v1/admin/organizations")
@RequiredArgsConstructor
@Slf4j
public class OrganizationController {

    private final OrganizationService organizationService;

    /**
     * Get all organizations
     */
    @GetMapping
    public ResponseEntity<List<OrganizationResponse>> getAllOrganizations() {
        log.info("GET /api/v1/admin/organizations");
        List<OrganizationResponse> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(organizations);
    }

    /**
     * Get organization by ID with full details
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrganizationDetailResponse> getOrganizationById(@PathVariable UUID id) {
        log.info("GET /api/v1/admin/organizations/{}", id);
        OrganizationDetailResponse organization = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(organization);
    }

    /**
     * Create a new organization
     */
    @PostMapping
    public ResponseEntity<OrganizationResponse> createOrganization(
            @Valid @RequestBody OrganizationRequest request) {
        log.info("POST /api/v1/admin/organizations - Creating organization: {}", request.getName());
        OrganizationResponse response = organizationService.createOrganization(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update organization details
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrganizationResponse> updateOrganization(
            @PathVariable UUID id,
            @Valid @RequestBody OrganizationRequest request) {
        log.info("PUT /api/v1/admin/organizations/{}", id);
        OrganizationResponse response = organizationService.updateOrganization(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Update organization status (activate/suspend)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrganizationResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request) {
        log.info("PATCH /api/v1/admin/organizations/{}/status - New status: {}", id, request.getStatus());
        OrganizationResponse response = organizationService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete organization (soft delete - suspends the organization)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable UUID id) {
        log.info("DELETE /api/v1/admin/organizations/{}", id);
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }
}
