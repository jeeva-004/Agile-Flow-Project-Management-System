package com.agileflow.agileflow_backend.user.dto;

import com.agileflow.agileflow_backend.common.enums.UserStatus;
import lombok.*;

import java.util.Set;
@Getter
@Setter
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private UserStatus status;

    private Set<String> roles;

    // Getters and Setters
}