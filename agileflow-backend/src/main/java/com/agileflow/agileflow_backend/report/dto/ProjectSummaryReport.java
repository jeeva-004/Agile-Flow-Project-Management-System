package com.agileflow.agileflow_backend.report.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSummaryReport {
    private Long totalIssues;
    private Long completedIssues;
    private Double completionPercentage;
    private Double totalWorklogHours;
    private List<MemberContribution> memberContribution;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberContribution {
        private Long userId;
        private String userName;
        private Long assignedIssueCount;
        private Double totalLoggedHours;
    }
}
