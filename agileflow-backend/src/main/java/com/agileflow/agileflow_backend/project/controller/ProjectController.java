package com.agileflow.agileflow_backend.project.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;
import com.agileflow.agileflow_backend.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ApiResponse<?> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return new ApiResponse<>(

                true,

                "Projects fetched successfully",

                projectService.findAll(pageable)

        );

    }

    @GetMapping("/search")
    public ApiResponse<?> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return new ApiResponse<>(
                true,
                "Projects searched successfully",
                projectService.search(keyword, ownerId, pageable)
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