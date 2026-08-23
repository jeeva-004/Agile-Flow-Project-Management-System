package com.agileflow.agileflow_backend.dashboard.dto;
import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import lombok.*;
import java.util.List;

@Getter
@Setter
public class ProjectManagerDashboardResponse {

    private Long managedProjects;

    private Long teamMembers;

    private Long activeSprints;

    private Long openIssues;

    private Long completedIssues;

    private List<ProjectCardDto> activeProjects;

    private List<ActivityResponse> recentActivities;
}