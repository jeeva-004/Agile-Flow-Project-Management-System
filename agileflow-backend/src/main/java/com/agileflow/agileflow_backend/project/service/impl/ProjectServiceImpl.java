package com.agileflow.agileflow_backend.project.service.impl;

import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.ProjectResponse;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.project.service.ProjectService;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class ProjectServiceImpl
        implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final IssueRepository issueRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SprintRepository sprintRepository;
    private final ActivityService activityService;
    public ProjectServiceImpl(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService,
            NotificationService notificationService,
            IssueRepository issueRepository,
            ProjectMemberRepository projectMemberRepository,
            SprintRepository sprintRepository,
            ActivityService activityService) {

        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
        this.issueRepository = issueRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.sprintRepository = sprintRepository;
        this.activityService = activityService;
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
        project = projectRepository.save(project);
        notificationService.create(

                owner,

                "Project Created",

                "Project " + project.getName() + " was created",

                NotificationType.PROJECT_CREATED,

                "/projects/" + project.getId()

        );
        activityService.create(

                owner,

                project,

                "CREATE_PROJECT",

                owner.getFirstName()

                        + " created project "

                        + project.getName(),

                "PROJECT",

                project.getId()

        );
        return map(project);
    }

    @Override
    public Page<ProjectResponse> findAll(Pageable pageable) {

        return projectRepository.findAll(pageable)
                .map(this::map);

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

        notificationService.create(

                project.getOwner(),

                "Project Updated",

                "Project " + project.getName() + " was updated",

                NotificationType.PROJECT_UPDATED,

                "/projects/" + project.getId()

        );

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                project,

                "UPDATE_PROJECT",

                currentUser.getFirstName()

                        + " updated project "

                        + project.getName(),

                "PROJECT",

                project.getId()

        );

        return map(

                projectRepository.save(

                        project));

    }

    @Override
    public void delete(
            Long id) {

        Project project =

                projectRepository.findById(
                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"));

        if(issueRepository.existsByProjectId(id)) {

            throw new IllegalArgumentException(

                    "Project contains issues. Delete issues first."

            );

        }

        if(sprintRepository.existsByProjectId(id)) {

            throw new IllegalArgumentException(

                    "Project contains sprints."

            );

        }

        if(projectMemberRepository.existsByProjectId(id)) {

            throw new IllegalArgumentException(

                    "Project contains members."

            );

        }

        notificationService.create(

                project.getOwner(),

                "Project Deleted",

                "Project "
                        + project.getName()
                        + " was deleted",

                NotificationType.PROJECT_DELETED,

                "/projects"

        );

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                project,

                "DELETE_PROJECT",

                currentUser.getFirstName()

                        + " deleted project "

                        + project.getName(),

                "PROJECT",

                project.getId()

        );

        projectRepository.delete(

                project

        );


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