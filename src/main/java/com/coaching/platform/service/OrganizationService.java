package com.coaching.platform.service;

import com.coaching.platform.dto.*;
import com.coaching.platform.entity.Batch;
import com.coaching.platform.entity.Organization;
import com.coaching.platform.entity.User;
import com.coaching.platform.enums.OrganizationStatus;
import com.coaching.platform.enums.Role;
import com.coaching.platform.exception.DuplicateResourceException;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.OrganizationRepository;
import com.coaching.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing organizations (coaching institutes)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Create a new organization with an admin user
     */
    @Transactional
    public OrganizationResponse createOrganization(OrganizationRequest request) {
        ensureSuperAdmin();

        log.info("Creating new organization: {}", request.getName());

        // Check if organization already exists
        if (organizationRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Organization with name '" + request.getName() + "' already exists");
        }

        // Check if admin email already exists
        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new DuplicateResourceException("User with email '" + request.getAdminEmail() + "' already exists");
        }

        // Create admin user
        User adminUser = User.builder()
                .username(request.getAdminEmail()) // Using email as username
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .firstName(extractFirstName(request.getAdminName()))
                .lastName(extractLastName(request.getAdminName()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        adminUser = userRepository.save(adminUser);
        log.info("Created admin user: {}", adminUser.getEmail());

        // Create organization
        Organization organization = Organization.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .status(OrganizationStatus.ACTIVE) // Active by default
                .adminContact(adminUser)
                .build();

        organization = organizationRepository.save(organization);
        log.info("Organization created successfully with ID: {}", organization.getOrgId());

        return convertToResponse(organization);
    }

    /**
     * Get all organizations (SUPER_ADMIN only)
     */
    public List<OrganizationResponse> getAllOrganizations() {
        ensureSuperAdmin();

        log.info("Fetching all organizations");
        List<Organization> organizations = organizationRepository.findAll();

        return organizations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get organization by ID with full details
     */
    public OrganizationDetailResponse getOrganizationById(UUID orgId) {
        ensureSuperAdmin();

        log.info("Fetching organization: {}", orgId);
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + orgId));

        return convertToDetailResponse(organization);
    }

    /**
     * Update organization details
     */
    @Transactional
    public OrganizationResponse updateOrganization(UUID orgId, OrganizationRequest request) {
        ensureSuperAdmin();

        log.info("Updating organization: {}", orgId);
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + orgId));

        // Check for duplicate name if name is being changed
        if (!organization.getName().equals(request.getName()) &&
                organizationRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Organization with name '" + request.getName() + "' already exists");
        }

        organization.setName(request.getName());
        organization.setDescription(request.getDescription());
        organization.setAddress(request.getAddress());
        organization.setPhone(request.getPhone());
        organization.setEmail(request.getEmail());

        organization = organizationRepository.save(organization);
        log.info("Organization updated successfully: {}", orgId);

        return convertToResponse(organization);
    }

    /**
     * Update organization status (activate/suspend)
     */
    @Transactional
    public OrganizationResponse updateStatus(UUID orgId, UpdateStatusRequest request) {
        ensureSuperAdmin();

        log.info("Updating status for organization {} to {}", orgId, request.getStatus());
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + orgId));

        organization.setStatus(request.getStatus());
        organization = organizationRepository.save(organization);

        log.info("Organization status updated successfully: {}", orgId);
        return convertToResponse(organization);
    }

    /**
     * Delete organization (soft delete - mark as suspended)
     */
    @Transactional
    public void deleteOrganization(UUID orgId) {
        ensureSuperAdmin();

        log.info("Deleting organization: {}", orgId);
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with ID: " + orgId));

        organization.suspend();
        organizationRepository.save(organization);
        log.info("Organization suspended: {}", orgId);
    }

    /**
     * Ensure the current user is a SUPER_ADMIN
     */
    private void ensureSuperAdmin() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != Role.SUPER_ADMIN) {
            throw new UnauthorizedException("Only SUPER_ADMIN users can manage organizations");
        }
    }

    /**
     * Convert Organization to OrganizationResponse
     */
    private OrganizationResponse convertToResponse(Organization org) {
        User admin = org.getAdminContact();

        return OrganizationResponse.builder()
                .orgId(org.getOrgId())
                .name(org.getName())
                .description(org.getDescription())
                .status(org.getStatus())
                .address(org.getAddress())
                .phone(org.getPhone())
                .email(org.getEmail())
                .adminId(admin != null ? admin.getId() : null)
                .adminName(admin != null ? admin.getFirstName() + " " + admin.getLastName() : null)
                .adminEmail(admin != null ? admin.getEmail() : null)
                .batchCount(org.getBatchCount())
                .createdAt(org.getCreatedAt())
                .updatedAt(org.getUpdatedAt())
                .build();
    }

    /**
     * Convert Organization to OrganizationDetailResponse
     */
    private OrganizationDetailResponse convertToDetailResponse(Organization org) {
        User admin = org.getAdminContact();

        OrganizationDetailResponse.AdminContactDTO adminDTO = null;
        if (admin != null) {
            adminDTO = OrganizationDetailResponse.AdminContactDTO.builder()
                    .userId(admin.getId())
                    .username(admin.getUsername())
                    .email(admin.getEmail())
                    .firstName(admin.getFirstName())
                    .lastName(admin.getLastName())
                    .fullName(admin.getFirstName() + " " + admin.getLastName())
                    .build();
        }

        List<OrganizationDetailResponse.BatchSummaryDTO> batchDTOs = org.getBatches().stream()
                .map(this::convertBatchToSummary)
                .collect(Collectors.toList());

        return OrganizationDetailResponse.builder()
                .orgId(org.getOrgId())
                .name(org.getName())
                .description(org.getDescription())
                .status(org.getStatus())
                .address(org.getAddress())
                .phone(org.getPhone())
                .email(org.getEmail())
                .adminContact(adminDTO)
                .batches(batchDTOs)
                .createdAt(org.getCreatedAt())
                .updatedAt(org.getUpdatedAt())
                .build();
    }

    /**
     * Convert Batch to BatchSummaryDTO
     */
    private OrganizationDetailResponse.BatchSummaryDTO convertBatchToSummary(Batch batch) {
        return OrganizationDetailResponse.BatchSummaryDTO.builder()
                .batchId(batch.getId())
                .name(batch.getName())
                .description(batch.getDescription())
                .studentCount(batch.getStudents() != null ? batch.getStudents().size() : 0)
                .facultyCount(batch.getFaculty() != null ? batch.getFaculty().size() : 0)
                .build();
    }

    /**
     * Extract first name from full name
     */
    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts[0];
    }

    /**
     * Extract last name from full name
     */
    private String extractLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts.length > 1 ? String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length)) : "";
    }
}
