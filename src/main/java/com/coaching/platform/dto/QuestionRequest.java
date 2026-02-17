package com.coaching.platform.dto;

import com.coaching.platform.enums.QuestionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {

    @NotNull(message = "Question type is required")
    private QuestionType type;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Points are required")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;

    @NotNull(message = "Order number is required")
    private Integer orderNumber;

    // For objective questions
    private List<OptionRequest> options;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionRequest {
        @NotBlank(message = "Option text is required")
        private String optionText;

        @NotNull(message = "isCorrect flag is required")
        private Boolean isCorrect;

        @NotNull(message = "Order number is required")
        private Integer orderNumber;
    }
}
