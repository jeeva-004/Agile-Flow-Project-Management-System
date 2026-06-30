package com.agileflow.agileflow_backend.worklog.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
public class WorkLogResponse {

    private Long id;

    private Long issueId;

    private Long userId;

    private String userName;

    private Double hoursSpent;

    private String description;

    private LocalDate workDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // getters setters

}