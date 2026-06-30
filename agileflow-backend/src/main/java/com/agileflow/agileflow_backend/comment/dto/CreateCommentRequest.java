package com.agileflow.agileflow_backend.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class CreateCommentRequest {

    @NotBlank
    private String message;



}