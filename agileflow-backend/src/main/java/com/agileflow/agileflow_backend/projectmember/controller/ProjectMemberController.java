package com.agileflow.agileflow_backend.projectmember.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.projectmember.dto.AddProjectMemberRequest;
import com.agileflow.agileflow_backend.projectmember.service.ProjectMemberService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectMemberController {

    private final ProjectMemberService service;

    public ProjectMemberController(

            ProjectMemberService service) {

        this.service = service;

    }

    @PostMapping(

            "/api/v1/project-members")

    public ApiResponse<?> add(

            @Valid

            @RequestBody

            AddProjectMemberRequest request) {

        return new ApiResponse<>(

                true,

                "Member added successfully",

                service.add(request));

    }

    @GetMapping(

            "/api/v1/projects/{projectId}/members")

    public ApiResponse<?> findByProject(

            @PathVariable

            Long projectId) {

        return new ApiResponse<>(

                true,

                "Members fetched successfully",

                service.findByProject(

                        projectId));

    }

    @DeleteMapping(

            "/api/v1/project-members/{id}")

    public ApiResponse<?> remove(

            @PathVariable

            Long id) {

        service.remove(id);

        return new ApiResponse<>(

                true,

                "Member removed successfully",

                null);

    }

}