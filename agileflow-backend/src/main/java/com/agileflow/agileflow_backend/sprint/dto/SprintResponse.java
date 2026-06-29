package com.agileflow.agileflow_backend.sprint.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class SprintResponse {

    private Long id;

    private String name;

    private LocalDate startDate;

    private LocalDate endDate;

    private Long projectId;

    private String projectName;

    // getters setters

}