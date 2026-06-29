package com.agileflow.agileflow_backend.issue.dto;

import com.agileflow.agileflow_backend.common.enums.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class IssueResponse {

    private Long id;

    private String title;

    private String description;

    private IssueStatus status;

    private IssuePriority priority;

    private IssueType type;

    private Integer estimateHours;

    private LocalDate dueDate;

    private Long projectId;

    private String projectName;

    private Long sprintId;

    private String sprintName;

    private Long assigneeId;

    private String assigneeName;

    private Long createdById;

    private String createdByName;

    // getters setters

}