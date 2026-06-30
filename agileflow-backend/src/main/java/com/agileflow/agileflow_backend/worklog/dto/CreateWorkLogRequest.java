package com.agileflow.agileflow_backend.worklog.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class CreateWorkLogRequest {

    @NotNull
    private Double hoursSpent;

    private String description;

    @NotNull
    private LocalDate workDate;

}