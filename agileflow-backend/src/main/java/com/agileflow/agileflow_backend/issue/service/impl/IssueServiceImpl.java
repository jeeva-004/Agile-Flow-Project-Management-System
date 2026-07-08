package com.agileflow.agileflow_backend.issue.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.dto.*;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.issue.service.IssueService;
import com.agileflow.agileflow_backend.issuehistory.service.IssueHistoryService;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import org.springframework.stereotype.Service;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import com.agileflow.agileflow_backend.attachment.repository.AttachmentRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Objects;
import com.agileflow.agileflow_backend.activity.service.ActivityService;
@Service
public class IssueServiceImpl
        implements IssueService {

    private final IssueRepository issueRepository;

    private final ProjectRepository projectRepository;

    private final SprintRepository sprintRepository;

    private final UserRepository userRepository;

    private final CurrentUserService currentUserService;

    private final NotificationService notificationService;
    private final CommentRepository commentRepository;
    private final WorkLogRepository workLogRepository;
    private final ActivityService activityService;
    private final IssueHistoryService issueHistoryService;
    private final AttachmentRepository attachmentRepository;

    public IssueServiceImpl(

            IssueRepository issueRepository,

            ProjectRepository projectRepository,

            SprintRepository sprintRepository,

            UserRepository userRepository,

            CurrentUserService currentUserService,

            NotificationService notificationService,
            CommentRepository commentRepository,
            WorkLogRepository workLogRepository,
            ActivityService activityService,
            IssueHistoryService issueHistoryService,
            AttachmentRepository attachmentRepository
    ) {

        this.issueRepository =
                issueRepository;

        this.projectRepository =
                projectRepository;

        this.sprintRepository =
                sprintRepository;

        this.userRepository =
                userRepository;

        this.currentUserService = currentUserService;

        this.notificationService = notificationService;
        this.commentRepository = commentRepository;
        this.workLogRepository = workLogRepository;
        this.activityService =  activityService;
        this.issueHistoryService = issueHistoryService;
        this.attachmentRepository = attachmentRepository;
    }


    @Override
    public IssueResponse create(

            CreateIssueRequest request) {

        Project project =

                projectRepository.findById(

                                request.getProjectId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"));

        Sprint sprint = null;

        if (request.getSprintId() != null) {

            sprint = sprintRepository

                    .findById(

                            request.getSprintId())

                    .orElseThrow(() ->

                            new ResourceNotFoundException(

                                    "Sprint not found"));

        }

        User assignee = null;

        if (request.getAssigneeId() != null) {

            assignee = userRepository

                    .findById(

                            request.getAssigneeId())

                    .orElseThrow(() ->

                            new ResourceNotFoundException(

                                    "User not found"));

        }

        User createdBy =

                currentUserService

                        .getCurrentUser();

        Issue issue =

                new Issue();

        issue.setTitle(

                request.getTitle());

        issue.setDescription(

                request.getDescription());

        issue.setPriority(

                request.getPriority());

        issue.setType(

                request.getType());

        issue.setEstimateHours(

                request.getEstimateHours());

        issue.setDueDate(

                request.getDueDate());

        issue.setStatus(

                IssueStatus.TODO);

        issue.setProject(

                project);

        issue.setSprint(

                sprint);

        issue.setAssignee(

                assignee);

        issue.setCreatedBy(

                createdBy);

        issue = issueRepository.save(

                issue);

        activityService.create(

                createdBy,

                project,

                "CREATE_ISSUE",

                createdBy.getFirstName()
                        + " created issue "
                        + issue.getTitle(),

                "ISSUE",

                issue.getId()

        );

        issueHistoryService.create(

                createdBy,

                issue,

                "CREATE",

                "status",

                null,

                issue.getStatus() != null
                        ? issue.getStatus().toString()
                        : null

        );

        issueHistoryService.create(

                createdBy,

                issue,

                "CREATE",

                "priority",

                null,

                issue.getPriority() != null
                        ? issue.getPriority().toString()
                        : null

        );

        if (assignee != null) {

            issueHistoryService.create(

                    createdBy,

                    issue,

                    "CREATE",

                    "assignee",

                    null,

                    assignee.getFirstName()
                            + " "
                            + assignee.getLastName()

            );

        }

        if (assignee != null) {

            notificationService.create(

                    assignee,

                    "Issue Assigned",

                    issue.getTitle(),

                    NotificationType.ISSUE_ASSIGNED,

                    "/issues/" + issue.getId()

            );

        }


        return map(

                issue);

    }

    @Override
    public Page<IssueResponse>

    findByProject(

            Long projectId,

            Pageable pageable) {

        return issueRepository

                .findByProjectId(

                        projectId,

                        pageable)

                .map(this::map);

    }

    @Override
    public List<IssueResponse>

    findBySprint(

            Long sprintId) {

        return issueRepository

                .findBySprintId(

                        sprintId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public List<IssueResponse>

    findByAssignee(

            Long userId) {

        return issueRepository

                .findByAssigneeId(

                        userId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public IssueResponse findById(

            Long id) {

        Issue issue =

                issueRepository

                        .findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Issue not found"));

        return map(

                issue);

    }

    @Override
    public IssueResponse update(

            Long id,

            UpdateIssueRequest request) {

        Issue issue =

                issueRepository

                        .findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Issue not found"));

        IssueStatus oldStatus =

                issue.getStatus();

        Object oldPriority =

                issue.getPriority();

        User oldAssignee =

                issue.getAssignee();

        issue.setTitle(

                request.getTitle());

        issue.setDescription(

                request.getDescription());

        issue.setStatus(

                request.getStatus());

        issue.setPriority(

                request.getPriority());

        issue.setType(

                request.getType());

        issue.setEstimateHours(

                request.getEstimateHours());

        issue.setDueDate(

                request.getDueDate());

        if (request.getSprintId() != null) {

            Sprint sprint =

                    sprintRepository

                            .findById(

                                    request.getSprintId())

                            .orElseThrow(() ->

                                    new ResourceNotFoundException(

                                            "Sprint not found"));

            issue.setSprint(

                    sprint);

        }

        if (request.getAssigneeId() != null) {

            User user =

                    userRepository

                            .findById(

                                    request.getAssigneeId())

                            .orElseThrow(() ->

                                    new ResourceNotFoundException(

                                            "User not found"));

            issue.setAssignee(

                    user);

        }

        issue =

                issueRepository.save(

                        issue);

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                issue.getProject(),

                "UPDATE_ISSUE",

                currentUser.getFirstName()

                        + " updated issue "

                        + issue.getTitle(),

                "ISSUE",

                issue.getId()

        );

        if (

                !Objects.equals(

                        oldStatus,

                        issue.getStatus())

        ) {

            issueHistoryService.create(

                    currentUser,

                    issue,

                    "UPDATE",

                    "status",

                    oldStatus != null
                            ? oldStatus.toString()
                            : null,

                    issue.getStatus() != null
                            ? issue.getStatus().toString()
                            : null

            );

        }

        if (

                !Objects.equals(

                        oldPriority,

                        issue.getPriority())

        ) {

            issueHistoryService.create(

                    currentUser,

                    issue,

                    "UPDATE",

                    "priority",

                    oldPriority != null
                            ? oldPriority.toString()
                            : null,

                    issue.getPriority() != null
                            ? issue.getPriority().toString()
                            : null

            );

        }

        Long oldAssigneeId =

                oldAssignee != null
                        ? oldAssignee.getId()
                        : null;

        Long newAssigneeId =

                issue.getAssignee() != null
                        ? issue.getAssignee().getId()
                        : null;

        if (

                !Objects.equals(

                        oldAssigneeId,

                        newAssigneeId)

        ) {

            issueHistoryService.create(

                    currentUser,

                    issue,

                    "UPDATE",

                    "assignee",

                    oldAssignee != null
                            ? oldAssignee.getFirstName()
                              + " "
                              + oldAssignee.getLastName()
                            : null,

                    issue.getAssignee() != null
                            ? issue.getAssignee().getFirstName()
                              + " "
                              + issue.getAssignee().getLastName()
                            : null

            );

        }

        if (

                request.getAssigneeId()!=null &&

                        issue.getAssignee()!=null

        ) {

            notificationService.create(

                    issue.getAssignee(),

                    "Issue Updated",

                    issue.getTitle(),

                    NotificationType.ISSUE_UPDATED,

                    "/issues/" + issue.getId()

            );

        }

        return map(

                issue);

    }

    @Override
    @Transactional
    public void delete(

            Long id) {

        Issue issue =
                issueRepository
                        .findById(
                                id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Issue not found"));

        if (commentRepository.existsByIssueId(id)) {
            throw new IllegalArgumentException("Issue contains comments. Delete comments first.");
        }
        if (workLogRepository.existsByIssueId(id)) {
            throw new IllegalArgumentException("Issue contains worklogs. Delete worklogs first.");
        }
        if (attachmentRepository.existsByIssueId(id)) {
            throw new IllegalArgumentException("Issue contains attachments. Delete attachments first.");
        }

        if (issue.getAssignee() != null) {
            notificationService.create(

                    issue.getAssignee(),

                    "Issue Deleted",

                    issue.getTitle(),

                    NotificationType.ISSUE_DELETED,

                    "/issues"

            );
        }

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                issue.getProject(),

                "DELETE_ISSUE",

                currentUser.getFirstName()

                        + " deleted issue "

                        + issue.getTitle(),

                "ISSUE",

                issue.getId()

        );

        issueHistoryService.deleteByIssueId(id);

        issueRepository.delete(
                issue);
    }

    private IssueResponse map(

            Issue issue) {

        IssueResponse response =

                new IssueResponse();

        response.setId(

                issue.getId());

        response.setTitle(

                issue.getTitle());

        response.setDescription(

                issue.getDescription());

        response.setStatus(

                issue.getStatus());

        response.setPriority(

                issue.getPriority());

        response.setType(

                issue.getType());

        response.setEstimateHours(

                issue.getEstimateHours());

        response.setDueDate(

                issue.getDueDate());

        response.setProjectId(

                issue.getProject().getId());

        response.setProjectName(

                issue.getProject().getName());

        if (issue.getSprint() != null) {

            response.setSprintId(

                    issue.getSprint().getId());

            response.setSprintName(

                    issue.getSprint().getName());

        }

        if (issue.getAssignee() != null) {

            response.setAssigneeId(

                    issue.getAssignee().getId());

            response.setAssigneeName(

                    issue.getAssignee()

                            .getFirstName()

                            + " "

                            +

                            issue.getAssignee()

                                    .getLastName());

        }

        response.setCreatedById(

                issue.getCreatedBy()

                        .getId());

        response.setCreatedByName(

                issue.getCreatedBy()

                        .getFirstName()

                        + " "

                        +

                        issue.getCreatedBy()

                                .getLastName());

        return response;

    }

}