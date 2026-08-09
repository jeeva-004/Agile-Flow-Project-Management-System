package com.agileflow.agileflow_backend.activity.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
public class ActivityResponse {

    private Long id;

    private String action;

    private String message;

    private String entityType;

    private Long entityId;

    private Long userId;

    private String userName;

    private Long projectId;

    private LocalDateTime createdAt;

}