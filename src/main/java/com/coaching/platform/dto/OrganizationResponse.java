package com.coaching.platform.dto;

import com.coaching.platform.enums.OrganizationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for organization list view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationResponse {

    private UUID orgId;
    private String name;
    private String description;
    private OrganizationStatus status;
    private String address;
    private String phone;
    private String email;

    // Admin contact summary
    private UUID adminId;
    private String adminName;
    private String adminEmail;

    // Statistics
    private int batchCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
