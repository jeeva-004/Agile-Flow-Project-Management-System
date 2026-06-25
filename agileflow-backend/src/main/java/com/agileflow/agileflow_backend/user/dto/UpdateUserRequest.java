package com.agileflow.agileflow_backend.user.dto;

import com.agileflow.agileflow_backend.common.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    private UserStatus status;

    @NotEmpty
    private Set<Long> roleIds;

    // Getters and Setters
}