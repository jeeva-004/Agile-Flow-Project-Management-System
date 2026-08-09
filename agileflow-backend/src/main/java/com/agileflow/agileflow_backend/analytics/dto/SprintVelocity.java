package com.agileflow.agileflow_backend.analytics.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SprintVelocity {
    private Long sprintId;
    private String sprintName;
    private Long plannedIssueCount;
    private Long completedIssueCount;
}
