package com.agileflow.agileflow_backend.projectmember.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.dto.AddProjectMemberRequest;
import com.agileflow.agileflow_backend.projectmember.dto.ProjectMemberResponse;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.projectmember.service.ProjectMemberService;
import lombok.*;
import org.springframework.stereotype.Service;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;

import java.util.List;
import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.security.CurrentUserService;

@Getter
@Setter
@Service
public class ProjectMemberServiceImpl
        implements ProjectMemberService {

    private final ProjectMemberRepository repository;

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final NotificationService notificationService;

    private final IssueRepository issueRepository;
    private final CommentRepository commentRepository;
    private final WorkLogRepository workLogRepository;
    private final ActivityService activityService;

    private final CurrentUserService currentUserService;
    public ProjectMemberServiceImpl(

            ProjectMemberRepository repository,

            ProjectRepository projectRepository,

            UserRepository userRepository,
            NotificationService notificationService,
            IssueRepository issueRepository,
            CommentRepository commentRepository,
            WorkLogRepository workLogRepository,
            ActivityService activityService,

            CurrentUserService currentUserService) {

        this.repository = repository;

        this.projectRepository = projectRepository;

        this.userRepository = userRepository;

        this.notificationService = notificationService;
        this.issueRepository = issueRepository;
        this.commentRepository = commentRepository;
        this.workLogRepository = workLogRepository;
        this.activityService = activityService;

        this.currentUserService = currentUserService;
    }

    @Override
    public ProjectMemberResponse add(

            AddProjectMemberRequest request) {

        if (repository.existsByProjectIdAndUserId(

                request.getProjectId(),

                request.getUserId())) {

            throw new IllegalArgumentException(

                    "User already assigned");

        }

        Project project =

                projectRepository.findById(

                                request.getProjectId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"));

        User user =

                userRepository.findById(

                                request.getUserId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "User not found"));

        ProjectMember member =

                new ProjectMember();

        member.setProject(project);

        member.setUser(user);

        member = repository.save(member);

        User actor = currentUserService.getCurrentUser();

        activityService.create(

                actor,

                project,

                "ADD_MEMBER",

                actor.getFirstName()

                        + " added "

                        + user.getFirstName()

                        + " to project "

                        + project.getName(),

                "PROJECT_MEMBER",

                member.getId()

        );

        notificationService.create(

                user,

                "Added to Project",

                "You were added to " + project.getName(),

                NotificationType.PROJECT_MEMBER_ADDED,

                "/projects/" + project.getId()

        );
        return map(member);

    }

    @Override
    public List<ProjectMemberResponse>

    findByProject(

            Long projectId) {

        return repository

                .findByProjectId(

                        projectId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public void remove(

            Long id) {

        ProjectMember member =

                repository.findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Member not found"));

        Long projectId = member.getProject().getId();
        Long userId = member.getUser().getId();

        if (issueRepository.existsByProjectIdAndAssigneeId(projectId, userId)) {
            throw new IllegalArgumentException("Member has assigned issues in this project");
        }
        if (issueRepository.existsByProjectIdAndCreatedById(projectId, userId)) {
            throw new IllegalArgumentException("Member has created issues in this project");
        }
        if (commentRepository.existsByIssueProjectIdAndAuthorId(projectId, userId)) {
            throw new IllegalArgumentException("Member has authored comments in this project");
        }
        if (workLogRepository.existsByIssueProjectIdAndUserId(projectId, userId)) {
            throw new IllegalArgumentException("Member has worklogs in this project");
        }

        notificationService.create(

                member.getUser(),

                "Removed from Project",

                "You were removed from "
                        + member.getProject().getName(),

                NotificationType.PROJECT_MEMBER_REMOVED,

                "/projects"

        );

        User actor = currentUserService.getCurrentUser();

        activityService.create(

                actor,

                member.getProject(),

                "REMOVE_MEMBER",

                actor.getFirstName()

                        + " removed "

                        + member.getUser().getFirstName()

                        + " from project "

                        + member.getProject().getName(),

                "PROJECT_MEMBER",

                member.getId()

        );

        repository.delete(member);

    }

    private ProjectMemberResponse map(

            ProjectMember member) {

        ProjectMemberResponse response =

                new ProjectMemberResponse();

        response.setId(

                member.getId());

        response.setProjectId(

                member.getProject()

                        .getId());

        response.setUserId(

                member.getUser()

                        .getId());

        response.setUserName(

                member.getUser()

                        .getFirstName()

                        + " "

                        +

                        member.getUser()

                                .getLastName());

        response.setEmail(

                member.getUser()

                        .getEmail());

        return response;

    }

}