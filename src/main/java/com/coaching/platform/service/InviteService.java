package com.coaching.platform.service;

import com.coaching.platform.dto.*;
import com.coaching.platform.entity.User;
import com.coaching.platform.entity.UserInvite;
import com.coaching.platform.enums.Role;
import com.coaching.platform.exception.DuplicateResourceException;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.repository.UserInviteRepository;
import com.coaching.platform.repository.UserRepository;
import com.coaching.platform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service handling invite-based user sign-up workflow
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InviteService {

    private final UserInviteRepository inviteRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Sign up a user using an invite token
     */
    @Transactional
    public AuthResponse signUpWithInvite(String token, SignUpWithInviteRequest request) {
        log.info("Processing sign-up with invite token: {}", token);

        // Find and validate invite
        UserInvite invite = inviteRepository.findByInviteToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid invite token"));

        if (!invite.isValid()) {
            throw new UnauthorizedException("Invite has expired or been used");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(invite.getEmail())) {
            throw new DuplicateResourceException("User with this email already exists");
        }

        // Create username from email
        String username = invite.getEmail().split("@")[0];
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = invite.getEmail().split("@")[0] + counter++;
        }

        // Create user
        User user = User.builder()
                .username(username)
                .email(invite.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(invite.getRole())
                .organization(invite.getOrganization())
                .enabled(true)
                .build();

        user = userRepository.save(user);
        log.info("User created from invite: {} with role {}", user.getEmail(), user.getRole());

        // Mark invite as accepted
        invite.accept();
        inviteRepository.save(invite);

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    /**
     * Validate an invite token
     */
    public InviteResponse validateInvite(String token) {
        UserInvite invite = inviteRepository.findByInviteToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid invite token"));

        return convertToResponse(invite);
    }

    /**
     * Convert UserInvite to InviteResponse
     */
    private InviteResponse convertToResponse(UserInvite invite) {
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
