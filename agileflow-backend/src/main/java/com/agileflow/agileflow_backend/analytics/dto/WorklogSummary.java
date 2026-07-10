package com.agileflow.agileflow_backend.analytics.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorklogSummary {
    private Long userId;
    private String userName;
    private Double averageHours;
    private Double totalHours;
}
