package com.agileflow.agileflow_backend.dashboard.dto;
import lombok.*;

@Getter
@Setter
public class ProjectManagerDashboardResponse {

    private Long managedProjects;

    private Long teamMembers;

    private Long activeSprints;

    private Long openIssues;

    private Long completedIssues;

}