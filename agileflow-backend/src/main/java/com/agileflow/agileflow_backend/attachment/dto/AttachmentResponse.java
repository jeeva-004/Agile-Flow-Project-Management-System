package com.agileflow.agileflow_backend.attachment.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
public class AttachmentResponse {

    private Long id;

    private String fileName;

    private String originalFileName;

    private String contentType;

    private Long fileSize;

    private Long issueId;

    private Long uploadedById;

    private String uploadedByName;

    private LocalDateTime uploadedAt;

    public AttachmentResponse() {
    }

    // getters setters

}