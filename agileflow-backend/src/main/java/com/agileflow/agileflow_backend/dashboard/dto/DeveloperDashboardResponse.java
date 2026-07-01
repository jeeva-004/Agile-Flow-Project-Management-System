package com.agileflow.agileflow_backend.dashboard.dto;
import lombok.*;

@Getter
@Setter
public class DeveloperDashboardResponse {

    private Long assignedIssues;

    private Long completedIssues;

    private Long myComments;

    private Long myWorkLogs;

}