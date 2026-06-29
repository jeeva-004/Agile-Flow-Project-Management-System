package com.agileflow.agileflow_backend.issue.dto;

import com.agileflow.agileflow_backend.common.enums.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
public class CreateIssueRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private IssuePriority priority;

    @NotNull
    private IssueType type;

    private Integer estimateHours;

    private LocalDate dueDate;

    @NotNull
    private Long projectId;

    private Long sprintId;

    private Long assigneeId;

    // getters setters

}