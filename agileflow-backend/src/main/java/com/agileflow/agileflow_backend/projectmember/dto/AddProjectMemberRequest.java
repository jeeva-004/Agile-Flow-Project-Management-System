package com.agileflow.agileflow_backend.projectmember.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
public class AddProjectMemberRequest {

    @NotNull
    private Long projectId;

    @NotNull
    private Long userId;

    // getters setters

}