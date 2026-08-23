package com.agileflow.agileflow_backend.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectCardDto {
    private Long id;
    private String name;
    private String description;
    private String ownerName;
    private long totalIssues;
    private long completedIssues;
    private long totalSprints;
    private long completedSprints;
    private double totalWorkLogHours;
    private long totalMembers;
}
