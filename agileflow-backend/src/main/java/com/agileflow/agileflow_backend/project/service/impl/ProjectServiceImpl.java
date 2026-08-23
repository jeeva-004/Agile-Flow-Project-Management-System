package com.agileflow.agileflow_backend.project.service.impl;

import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.BadRequestException;
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
import com.agileflow.agileflow_backend.project.specification.ProjectSpecification;
import org.springframework.data.jpa.domain.Specification;

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
        User currentUser = currentUserService.getCurrentUser();
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (request.getEndDate() != null && request.getStartDate() != null && request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

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

        if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), owner.getId())) {
            com.agileflow.agileflow_backend.projectmember.entity.ProjectMember ownerMember =
                    new com.agileflow.agileflow_backend.projectmember.entity.ProjectMember();
            ownerMember.setProject(project);
            ownerMember.setUser(owner);
            projectMemberRepository.save(ownerMember);
        }
        notificationService.create(

                owner,

                "Project Created",

                "Project " + project.getName() + " was created",

                NotificationType.PROJECT_CREATED,

                "/projects/" + project.getId()

        );
        activityService.create(

                currentUser,

                project,

                "CREATE_PROJECT",

                currentUser.getFirstName()

                        + " created project "

                        + project.getName(),

                "PROJECT",

                project.getId()

        );
        return map(project);
    }

    @Override
    public Page<ProjectResponse> findAll(Pageable pageable) {
        User currentUser = currentUserService.getCurrentUser();
        java.util.Set<Long> allowedProjectIds = getAccessibleProjectIdsForUser(currentUser);

        if (allowedProjectIds == null) {
            return projectRepository.findAll(pageable).map(this::map);
        }

        if (allowedProjectIds.isEmpty()) {
            return Page.empty(pageable);
        }

        return projectRepository.findByIdIn(allowedProjectIds, pageable).map(this::map);
    }

    @Override
    public Page<ProjectResponse> search(
            String keyword,
            Long ownerId,
            Pageable pageable) {
        User currentUser = currentUserService.getCurrentUser();
        java.util.Set<Long> allowedProjectIds = getAccessibleProjectIdsForUser(currentUser);

        if (allowedProjectIds != null && allowedProjectIds.isEmpty()) {
            return Page.empty(pageable);
        }

        Specification<Project> spec = ProjectSpecification.filterProjects(keyword, ownerId, allowedProjectIds);
        return projectRepository.findAll(spec, pageable).map(this::map);
    }

    @Override
    public ProjectResponse findById(
            Long id) {
        User currentUser = currentUserService.getCurrentUser();
        java.util.Set<Long> allowedProjectIds = getAccessibleProjectIdsForUser(currentUser);

        if (allowedProjectIds != null && !allowedProjectIds.contains(id)) {
            throw new ResourceNotFoundException("Project not found");
        }

        return map(

                projectRepository.findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"))

        );

    }

    private java.util.Set<Long> getAccessibleProjectIdsForUser(User user) {
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == com.agileflow.agileflow_backend.common.enums.RoleName.ADMIN);
        if (isAdmin) {
            return null; // Unrestricted super power access for ADMIN
        }

        java.util.Set<Long> projectIds = new java.util.LinkedHashSet<>();
        boolean isPm = user.getRoles().stream().anyMatch(r -> r.getName() == com.agileflow.agileflow_backend.common.enums.RoleName.PROJECT_MANAGER);

        if (isPm) {
            // PM: managed (owned) projects + assigned (member) projects
            List<Project> owned = projectRepository.findByOwnerId(user.getId());
            for (Project p : owned) {
                projectIds.add(p.getId());
            }
            List<com.agileflow.agileflow_backend.projectmember.entity.ProjectMember> memberships = projectMemberRepository.findByUserId(user.getId());
            for (com.agileflow.agileflow_backend.projectmember.entity.ProjectMember pm : memberships) {
                if (pm.getProject() != null) {
                    projectIds.add(pm.getProject().getId());
                }
            }
        } else {
            // Developer: assigned (member) projects + projects with assigned issues
            List<com.agileflow.agileflow_backend.projectmember.entity.ProjectMember> memberships = projectMemberRepository.findByUserId(user.getId());
            for (com.agileflow.agileflow_backend.projectmember.entity.ProjectMember pm : memberships) {
                if (pm.getProject() != null) {
                    projectIds.add(pm.getProject().getId());
                }
            }
            List<com.agileflow.agileflow_backend.issue.entity.Issue> assignedIssues = issueRepository.findByAssigneeId(user.getId());
            for (com.agileflow.agileflow_backend.issue.entity.Issue issue : assignedIssues) {
                if (issue.getProject() != null) {
                    projectIds.add(issue.getProject().getId());
                }
            }
        }

        return projectIds;
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

        if (request.getEndDate() != null && request.getStartDate() != null && request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        project.setName(

                request.getName());

        project.setDescription(

                request.getDescription());

        project.setStartDate(

                request.getStartDate());

        project.setEndDate(

                request.getEndDate());

        project.setOwner(owner);

        if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), owner.getId())) {
            com.agileflow.agileflow_backend.projectmember.entity.ProjectMember ownerMember =
                    new com.agileflow.agileflow_backend.projectmember.entity.ProjectMember();
            ownerMember.setProject(project);
            ownerMember.setUser(owner);
            projectMemberRepository.save(ownerMember);
        }

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