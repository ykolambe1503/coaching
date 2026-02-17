package com.coaching.platform.dto;

import com.coaching.platform.enums.InviteStatus;
import com.coaching.platform.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for user invite
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteResponse {

    private UUID inviteId;
    private String email;
    private Role role;
    private String inviteLink;
    private InviteStatus status;
    private String invitedByName;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
}
