package com.coaching.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchSummary {

    private UUID id;
    private String name;
    private Integer studentCount;
    private Integer examCount;
}
