package com.coaching.platform.service;

import com.coaching.platform.dto.*;
import com.coaching.platform.entity.Organization;
import com.coaching.platform.entity.User;
import com.coaching.platform.entity.UserInvite;
import com.coaching.platform.enums.InviteStatus;
import com.coaching.platform.enums.Role;
import com.coaching.platform.exception.DuplicateResourceException;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.OrganizationRepository;
import com.coaching.platform.repository.UserInviteRepository;
import com.coaching.platform.repository.UserRepository;
import com.coaching.platform.security.OrgContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for managing users within an organization (org-scoped operations)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final UserInviteRepository inviteRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all faculty in the current organization
     */
    public List<UserResponse> getFacultyInOrg(UUID orgId) {
        log.info("Fetching faculty for organization: {}", orgId);
        List<User> faculty = userRepository.findByOrganization_OrgIdAndRole(orgId, Role.FACULTY);
        return faculty.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    /**
     * Get all students in the current organization
     */
    public List<UserResponse> getStudentsInOrg(UUID orgId) {
        log.info("Fetching students for organization: {}", orgId);
        List<User> students = userRepository.findByOrganization_OrgIdAndRole(orgId, Role.STUDENT);
        return students.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    /**
     * Create a new user in the organization
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request, UUID orgId) {
        log.info("Creating user {} in organization {}", request.getEmail(), orgId);

        // Verify organization exists
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        // Only FACULTY and STUDENT can be created by org admin
        if (request.getRole() == Role.ADMIN || request.getRole() == Role.SUPER_ADMIN) {
            throw new UnauthorizedException("Cannot create ADMIN or SUPER_ADMIN users");
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        // Generate username from email
        String username = request.getEmail().split("@")[0];
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = request.getEmail().split("@")[0] + counter++;
        }

        // Create user
        User user = User.builder()
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .organization(organization)
                .enabled(true)
                .build();

        user = userRepository.save(user);
        log.info("User created: {} with role {}", user.getEmail(), user.getRole());

        return convertToResponse(user);
    }

    /**
     * Get user profile
     */
    public UserResponse getUserProfile(UUID userId, UUID orgId) {
        log.info("Fetching user profile: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify user belongs to the organization
        if (user.getOrganization() == null || !user.getOrganization().getOrgId().equals(orgId)) {
            throw new UnauthorizedException("User does not belong to this organization");
        }

        return convertToResponse(user);
    }

    /**
     * Update user information
     */
    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request, UUID orgId) {
        log.info("Updating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify user belongs to the organization
        if (user.getOrganization() == null || !user.getOrganization().getOrgId().equals(orgId)) {
            throw new UnauthorizedException("User does not belong to this organization");
        }

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        user = userRepository.save(user);
        log.info("User updated: {}", userId);

        return convertToResponse(user);
    }

    /**
     * Delete user (soft delete - disable account)
     */
    @Transactional
    public void deleteUser(UUID userId, UUID orgId) {
        log.info("Deleting user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify user belongs to the organization
        if (user.getOrganization() == null || !user.getOrganization().getOrgId().equals(orgId)) {
            throw new UnauthorizedException("User does not belong to this organization");
        }

        // Get current user to prevent self-deletion
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);

        if (currentUser != null && currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("Cannot delete your own account");
        }

        // Soft delete - disable the account
        user.setEnabled(false);
        userRepository.save(user);
        log.info("User disabled: {}", userId);
    }

    /**
     * Create an invite for a new user
     */
    @Transactional
    public InviteResponse createInvite(InviteRequest request, UUID orgId) {
        log.info("Creating invite for {} in organization {}", request.getEmail(), orgId);

        // Verify organization exists
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        // Only FACULTY and STUDENT can be invited
        if (request.getRole() == Role.ADMIN || request.getRole() == Role.SUPER_ADMIN) {
            throw new UnauthorizedException("Cannot invite ADMIN or SUPER_ADMIN users");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with this email already exists");
        }

        // Check if there's already a pending invite
        if (inviteRepository.existsByEmailAndOrganization_OrgIdAndStatus(
                request.getEmail(), orgId, InviteStatus.PENDING)) {
            throw new DuplicateResourceException("Pending invite already exists for this email");
        }

        // Get current user
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // Create invite
        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(7); // 7 days expiry

        UserInvite invite = UserInvite.builder()
                .inviteToken(token)
                .email(request.getEmail())
                .role(request.getRole())
                .organization(organization)
                .invitedBy(currentUser)
                .status(InviteStatus.PENDING)
                .expiresAt(expiresAt)
                .build();

        invite = inviteRepository.save(invite);
        log.info("Invite created: {} for role {}", invite.getEmail(), invite.getRole());

        return convertToInviteResponse(invite);
    }

    /**
     * Get all invites for the organization
     */
    public List<InviteResponse> getInvites(UUID orgId) {
        log.info("Fetching invites for organization: {}", orgId);
        List<UserInvite> invites = inviteRepository.findByOrganization_OrgId(orgId);
        return invites.stream().map(this::convertToInviteResponse).collect(Collectors.toList());
    }

    /**
     * Resend an invite (regenerate token and expiry)
     */
    @Transactional
    public InviteResponse resendInvite(UUID inviteId, UUID orgId) {
        log.info("Resending invite: {}", inviteId);

        UserInvite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found"));

        // Verify invite belongs to the organization
        if (!invite.getOrganization().getOrgId().equals(orgId)) {
            throw new UnauthorizedException("Invite does not belong to this organization");
        }

        // Only resend pending invites
        if (invite.getStatus() != InviteStatus.PENDING) {
            throw new UnauthorizedException("Can only resend pending invites");
        }

        // Regenerate token and extend expiry
        invite.setInviteToken(UUID.randomUUID().toString());
        invite.setExpiresAt(LocalDateTime.now().plusDays(7));

        invite = inviteRepository.save(invite);
        log.info("Invite resent: {}", inviteId);

        return convertToInviteResponse(invite);
    }

    /**
     * Convert User to UserResponse
     */
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .organizationId(user.getOrganization() != null ? user.getOrganization().getOrgId() : null)
                .organizationName(user.getOrganization() != null ? user.getOrganization().getName() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Convert UserInvite to InviteResponse
     */
    private InviteResponse convertToInviteResponse(UserInvite invite) {
        String baseUrl = "http://localhost:5173"; // Should be configurable
        String inviteLink = baseUrl + "/signup/invite/" + invite.getInviteToken();

        return InviteResponse.builder()
                .inviteId(invite.getId())
                .email(invite.getEmail())
                .role(invite.getRole())
                .inviteLink(inviteLink)
                .status(invite.getStatus())
                .invitedByName(invite.getInvitedBy() != null
                        ? invite.getInvitedBy().getFirstName() + " " + invite.getInvitedBy().getLastName()
                        : null)
                .expiresAt(invite.getExpiresAt())
                .createdAt(invite.getCreatedAt())
                .acceptedAt(invite.getAcceptedAt())
                .build();
    }
}
