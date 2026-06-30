package com.agileflow.agileflow_backend.project.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.ProjectResponse;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.project.service.ProjectService;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl
        implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public ProjectResponse create(
            CreateProjectRequest request) {

        User owner = currentUserService.getCurrentUser();

        Project project =
                new Project();

        project.setName(
                request.getName());

        project.setDescription(
                request.getDescription());

        project.setStartDate(
                request.getStartDate());

        project.setEndDate(
                request.getEndDate());

        project.setOwner(owner);

        return map(
                projectRepository.save(
                        project));
    }

    @Override
    public List<ProjectResponse> findAll() {

        return projectRepository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    @Override
    public ProjectResponse findById(
            Long id) {

        return map(

                projectRepository.findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"))

        );

    }

    @Override
    public ProjectResponse update(

            Long id,

            UpdateProjectRequest request) {

        Project project =

                projectRepository.findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"));

        User owner =

                userRepository.findById(

                                request.getOwnerId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Owner not found"));

        project.setName(

                request.getName());

        project.setDescription(

                request.getDescription());

        project.setStartDate(

                request.getStartDate());

        project.setEndDate(

                request.getEndDate());

        project.setOwner(owner);

        return map(

                projectRepository.save(

                        project));

    }

    @Override
    public void delete(
            Long id) {

        if (!projectRepository.existsById(
                id)) {

            throw new ResourceNotFoundException(

                    "Project not found");

        }

        projectRepository.deleteById(id);

    }

    private ProjectResponse map(

            Project project) {

        ProjectResponse response =

                new ProjectResponse();

        response.setId(

                project.getId());

        response.setName(

                project.getName());

        response.setDescription(

                project.getDescription());

        response.setStartDate(

                project.getStartDate());

        response.setEndDate(

                project.getEndDate());

        response.setOwnerId(

                project.getOwner().getId());

        response.setOwnerName(

                project.getOwner()

                        .getFirstName()

                        + " "

                        + project.getOwner()

                        .getLastName());

        return response;

    }

}