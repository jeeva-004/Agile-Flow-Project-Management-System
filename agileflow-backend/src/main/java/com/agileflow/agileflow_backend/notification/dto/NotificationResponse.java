package com.agileflow.agileflow_backend.notification.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private String type;

    private Boolean read;

    private String redirectUrl;

    private LocalDateTime createdAt;

}