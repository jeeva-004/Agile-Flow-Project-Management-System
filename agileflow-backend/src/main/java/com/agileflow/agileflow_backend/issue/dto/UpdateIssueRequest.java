package com.agileflow.agileflow_backend.issue.dto;

import com.agileflow.agileflow_backend.common.enums.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateIssueRequest {

    private String title;

    private String description;

    private IssueStatus status;

    private IssuePriority priority;

    private IssueType type;

    private Integer estimateHours;

    private LocalDate dueDate;

    private Long sprintId;

    private Long assigneeId;

    // getters setters

}