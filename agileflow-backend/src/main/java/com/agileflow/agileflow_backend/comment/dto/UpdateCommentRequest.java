package com.agileflow.agileflow_backend.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class UpdateCommentRequest {

    @NotBlank
    private String message;

}