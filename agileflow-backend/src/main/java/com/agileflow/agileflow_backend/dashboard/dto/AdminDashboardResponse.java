package com.agileflow.agileflow_backend.dashboard.dto;
import lombok.*;

@Getter
@Setter
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalProjects;

    private Long totalIssues;

    private Long openIssues;

    private Long completedIssues;

    private Long totalWorkLogs;
}