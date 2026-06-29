package com.agileflow.agileflow_backend.issue.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.issue.dto.*;
import com.agileflow.agileflow_backend.issue.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class IssueController {

    private final IssueService service;

    public IssueController(

            IssueService service) {

        this.service = service;

    }

    @PostMapping("/issues")
    public ApiResponse<?> create(

            @Valid

            @RequestBody

            CreateIssueRequest request) {

        return new ApiResponse<>(

                true,

                "Issue created successfully",

                service.create(

                        request));

    }

    @GetMapping(

            "/issues/{id}")

    public ApiResponse<?> findById(

            @PathVariable

            Long id) {

        return new ApiResponse<>(

                true,

                "Issue fetched successfully",

                service.findById(

                        id));

    }

    @GetMapping(

            "/projects/{projectId}/issues")

    public ApiResponse<?> findByProject(

            @PathVariable

            Long projectId) {

        return new ApiResponse<>(

                true,

                "Issues fetched successfully",

                service.findByProject(

                        projectId));

    }

    @GetMapping(

            "/sprints/{sprintId}/issues")

    public ApiResponse<?> findBySprint(

            @PathVariable

            Long sprintId) {

        return new ApiResponse<>(

                true,

                "Issues fetched successfully",

                service.findBySprint(

                        sprintId));

    }

    @GetMapping(

            "/users/{userId}/issues")

    public ApiResponse<?> findByAssignee(

            @PathVariable

            Long userId) {

        return new ApiResponse<>(

                true,

                "Issues fetched successfully",

                service.findByAssignee(

                        userId));

    }

    @PutMapping(

            "/issues/{id}")

    public ApiResponse<?> update(

            @PathVariable

            Long id,

            @Valid

            @RequestBody

            UpdateIssueRequest request) {

        return new ApiResponse<>(

                true,

                "Issue updated successfully",

                service.update(

                        id,

                        request));

    }

    @DeleteMapping(

            "/issues/{id}")

    public ApiResponse<?> delete(

            @PathVariable

            Long id) {

        service.delete(

                id);

        return new ApiResponse<>(

                true,

                "Issue deleted successfully",

                null);

    }

}