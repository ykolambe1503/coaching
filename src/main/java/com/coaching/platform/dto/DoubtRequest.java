package com.coaching.platform.dto;

import lombok.*;

/**
 * Request DTO for asking AI doubts
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoubtRequest {

    private String question;
    private String context; // Optional: exam/topic context
}
