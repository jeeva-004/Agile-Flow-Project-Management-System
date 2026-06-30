package com.agileflow.agileflow_backend.worklog.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateWorkLogRequest {

    @NotNull
    private Double hoursSpent;

    private String description;

    @NotNull
    private LocalDate workDate;


}