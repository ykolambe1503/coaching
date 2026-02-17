package com.coaching.platform.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for AI doubt with answer
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoubtResponse {

    private UUID id;
    private String question;
    private String aiResponse;
    private String context;
    private LocalDateTime askedAt;
}
