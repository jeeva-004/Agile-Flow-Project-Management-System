package com.agileflow.agileflow_backend.comment.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
public class CommentResponse {

    private Long id;

    private String message;

    private Long issueId;

    private Long authorId;

    private String authorName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}