package com.agileflow.agileflow_backend.dashboard.dto;
import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import lombok.*;
import java.util.List;

@Getter
@Setter
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalProjects;

    private Long totalIssues;

    private Long openIssues;

    private Long completedIssues;

    private Long totalWorkLogs;

    private List<ProjectCardDto> activeProjects;

    private List<ActivityResponse> recentActivities;
}