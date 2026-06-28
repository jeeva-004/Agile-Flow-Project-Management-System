package com.agileflow.agileflow_backend.projectmember.dto;


import lombok.*;

@Getter
@Setter
public class ProjectMemberResponse {

    private Long id;

    private Long projectId;

    private Long userId;

    private String userName;

    private String email;

    // getters setters

}