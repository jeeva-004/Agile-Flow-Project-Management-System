package com.agileflow.agileflow_backend.project.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
public class ProjectResponse {

    private Long id;

    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private Long ownerId;

    private String ownerName;

    // getters setters

}