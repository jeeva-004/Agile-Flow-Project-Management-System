package com.agileflow.agileflow_backend.project.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;
import com.agileflow.agileflow_backend.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        "/api/v1/projects")
public class ProjectController {

    private final ProjectService
            projectService;

    public ProjectController(

            ProjectService projectService) {

        this.projectService =

                projectService;

    }

    @PostMapping
    public ApiResponse<?> create(

            @Valid

            @RequestBody

            CreateProjectRequest request) {

        return new ApiResponse<>(

                true,

                "Project created successfully",

                projectService.create(

                        request)

        );

    }

    @GetMapping
    public ApiResponse<?> findAll() {

        return new ApiResponse<>(

                true,

                "Projects fetched successfully",

                projectService.findAll()

        );

    }

    @GetMapping("/{id}")
    public ApiResponse<?> findById(

            @PathVariable Long id) {

        return new ApiResponse<>(

                true,

                "Project fetched successfully",

                projectService.findById(

                        id)

        );

    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(

            @PathVariable Long id,

            @Valid

            @RequestBody

            UpdateProjectRequest request) {

        return new ApiResponse<>(

                true,

                "Project updated successfully",

                projectService.update(

                        id,

                        request)

        );

    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(

            @PathVariable Long id) {

        projectService.delete(

                id);

        return new ApiResponse<>(

                true,

                "Project deleted successfully",

                null

        );

    }

}