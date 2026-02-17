package com.coaching.platform.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {

    @Min(value = 0, message = "Points cannot be negative")
    private Integer pointsAwarded;

    private String feedback;
}
