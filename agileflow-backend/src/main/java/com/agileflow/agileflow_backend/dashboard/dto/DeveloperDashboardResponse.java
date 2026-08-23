package com.agileflow.agileflow_backend.dashboard.dto;
import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import lombok.*;
import java.util.List;

@Getter
@Setter
public class DeveloperDashboardResponse {

    private Long assignedIssues;

    private Long completedIssues;

    private Long myComments;

    private Long myWorkLogs;

    private List<ProjectCardDto> activeProjects;

    private List<ActivityResponse> recentActivities;
}