package com.agileflow.agileflow_backend.sprint.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.sprint.dto.CreateSprintRequest;
import com.agileflow.agileflow_backend.sprint.dto.UpdateSprintRequest;
import com.agileflow.agileflow_backend.sprint.service.SprintService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(
            SprintService sprintService) {

        this.sprintService = sprintService;

    }

    @PostMapping("/sprints")
    public ApiResponse<?> create(

            @Valid
            @RequestBody
            CreateSprintRequest request) {

        return new ApiResponse<>(

                true,

                "Sprint created successfully",

                sprintService.create(request)

        );

    }

    @GetMapping(
            "/projects/{projectId}/sprints")
    public ApiResponse<?> findByProject(

            @PathVariable
            Long projectId) {

        return new ApiResponse<>(

                true,

                "Sprints fetched successfully",

                sprintService.findByProject(

                        projectId)

        );

    }

    @GetMapping(
            "/sprints/{id}")
    public ApiResponse<?> findById(

            @PathVariable
            Long id) {

        return new ApiResponse<>(

                true,

                "Sprint fetched successfully",

                sprintService.findById(id)

        );

    }

    @PutMapping(
            "/sprints/{id}")
    public ApiResponse<?> update(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            UpdateSprintRequest request) {

        return new ApiResponse<>(

                true,

                "Sprint updated successfully",

                sprintService.update(

                        id,

                        request)

        );

    }

    @DeleteMapping(
            "/sprints/{id}")
    public ApiResponse<?> delete(

            @PathVariable
            Long id) {

        sprintService.delete(id);

        return new ApiResponse<>(

                true,

                "Sprint deleted successfully",

                null

        );

    }

}