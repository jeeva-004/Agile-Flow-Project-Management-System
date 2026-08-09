package com.agileflow.agileflow_backend.issuehistory.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class IssueHistoryResponse {

    private Long id;

    private Long issueId;

    private Long userId;

    private String userName;

    private String action;

    private String fieldName;

    private String oldValue;

    private String newValue;

    private LocalDateTime createdAt;

}