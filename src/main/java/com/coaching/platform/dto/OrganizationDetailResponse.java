package com.coaching.platform.dto;

import com.coaching.platform.enums.OrganizationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Detailed response DTO for single organization view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationDetailResponse {

    private UUID orgId;
    private String name;
    private String description;
    private OrganizationStatus status;
    private String address;
    private String phone;
    private String email;

    // Admin contact details
    private AdminContactDTO adminContact;

    // Batches
    private List<BatchSummaryDTO> batches;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Nested DTO for admin contact
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminContactDTO {
        private UUID userId;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String fullName;
    }

    /**
     * Nested DTO for batch summary
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchSummaryDTO {
        private UUID batchId;
        private String name;
        private String description;
        private int studentCount;
        private int facultyCount;
    }
}
