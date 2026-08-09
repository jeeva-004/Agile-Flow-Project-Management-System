package com.agileflow.agileflow_backend.worklog.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.worklog.dto.*;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import com.agileflow.agileflow_backend.worklog.service.WorkLogService;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import com.agileflow.agileflow_backend.activity.service.ActivityService;

@Service
public class WorkLogServiceImpl
        implements WorkLogService {

    private final WorkLogRepository workLogRepository;
    private final IssueRepository issueRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    public WorkLogServiceImpl(
            WorkLogRepository workLogRepository,
            IssueRepository issueRepository,
            CurrentUserService currentUserService,
            NotificationService notificationService,
            ActivityService activityService) {

        this.workLogRepository =
                workLogRepository;

        this.issueRepository =
                issueRepository;

        this.currentUserService =
                currentUserService;

        this.notificationService = notificationService;

        this.activityService = activityService;
    }

    @Override
    public WorkLogResponse create(
            Long issueId,
            CreateWorkLogRequest request) {

        Issue issue =

                issueRepository

                        .findById(issueId)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Issue not found"

                                ));

        User currentUser =

                currentUserService
                        .getCurrentUser();

        WorkLog workLog =

                new WorkLog();

        workLog.setIssue(

                issue

        );

        workLog.setUser(

                currentUser

        );

        workLog.setHoursSpent(

                request.getHoursSpent()

        );

        workLog.setDescription(

                request.getDescription()

        );

        workLog.setWorkDate(

                request.getWorkDate()

        );

        workLog =

                workLogRepository.save(

                        workLog

                );

        activityService.create(

                currentUser,

                issue.getProject(),

                "CREATE_WORKLOG",

                currentUser.getFirstName()

                        + " logged "

                        + request.getHoursSpent()

                        + "h on "

                        + issue.getTitle(),

                "WORKLOG",

                workLog.getId()

        );

        User assignee =

                issue.getAssignee();

        if (

                assignee != null

        ) {

            notificationService.create(

                    assignee,

                    "Work Logged",

                    currentUser.getFirstName()

                            + " logged "

                            + request.getHoursSpent()

                            + "h",

                    NotificationType.WORKLOG_CREATED,

                    "/issues/" + issue.getId()

            );

        }

        return map(

                workLog

        );

    }

    @Override
    public Page<WorkLogResponse>
    findByIssue(Long issueId, Pageable pageable) {

        return workLogRepository

                .findByIssueId(

                        issueId,
                        pageable

                )

                .map(this::map);

    }

    @Override
    public Page<WorkLogResponse>
    findByUser(Long userId, Pageable pageable) {

        return workLogRepository

                .findByUserId(

                        userId,
                        pageable

                )

                .map(this::map);

    }

    @Override
    public List<WorkLogResponse>
    findByIssue(Long issueId) {

        return workLogRepository

                .findByIssueId(

                        issueId

                )

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public List<WorkLogResponse>
    findByUser(Long userId) {

        return workLogRepository

                .findByUserId(

                        userId

                )

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public WorkLogResponse findById(
            Long id) {

        WorkLog workLog =

                workLogRepository

                        .findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "WorkLog not found"

                                ));

        return map(

                workLog

        );

    }

    @Override
    public WorkLogResponse update(
            Long id,
            UpdateWorkLogRequest request) {

        WorkLog workLog =

                workLogRepository

                        .findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "WorkLog not found"

                                ));

        workLog.setHoursSpent(

                request.getHoursSpent()

        );

        workLog.setDescription(

                request.getDescription()

        );

        workLog.setWorkDate(

                request.getWorkDate()

        );

        workLog =

                workLogRepository.save(

                        workLog

                );

        if (workLog.getIssue().getAssignee() != null) {
            notificationService.create(

                    workLog.getIssue()

                            .getAssignee(),

                    "WorkLog Updated",

                    workLog.getIssue()

                            .getTitle(),

                    NotificationType.WORKLOG_UPDATED,

                    "/issues/" +

                            workLog.getIssue()

                                    .getId()

            );
        }

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                workLog.getIssue()
                        .getProject(),

                "UPDATE_WORKLOG",

                currentUser.getFirstName()

                        + " updated worklog on "

                        + workLog.getIssue()
                        .getTitle(),

                "WORKLOG",

                workLog.getId()

        );

        return map(

                workLog

        );

    }

    @Override
    public void delete(
            Long id) {

        WorkLog workLog =

                workLogRepository

                        .findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "WorkLog not found"

                                ));

        if (workLog.getIssue().getAssignee() != null) {
            notificationService.create(

                    workLog.getIssue()

                            .getAssignee(),

                    "WorkLog Deleted",

                    workLog.getIssue()

                            .getTitle(),

                    NotificationType.WORKLOG_DELETED,

                    "/issues/" +

                            workLog.getIssue()

                                    .getId()

            );
        }

        User currentUser =

                currentUserService
                        .getCurrentUser();

        activityService.create(

                currentUser,

                workLog.getIssue()
                        .getProject(),

                "DELETE_WORKLOG",

                currentUser.getFirstName()

                        + " deleted worklog on "

                        + workLog.getIssue()
                        .getTitle(),

                "WORKLOG",

                workLog.getId()

        );

        workLogRepository.delete(

                workLog

        );

    }

    private WorkLogResponse map(
            WorkLog workLog) {

        WorkLogResponse response =

                new WorkLogResponse();

        response.setId(

                workLog.getId()

        );

        response.setIssueId(

                workLog.getIssue()

                        .getId()

        );

        response.setUserId(

                workLog.getUser()

                        .getId()

        );

        response.setUserName(

                workLog.getUser()

                        .getFirstName()

                        + " "

                        +

                        workLog.getUser()

                                .getLastName()

        );

        response.setHoursSpent(

                workLog.getHoursSpent()

        );

        response.setDescription(

                workLog.getDescription()

        );

        response.setWorkDate(

                workLog.getWorkDate()

        );

        response.setCreatedAt(

                workLog.getCreatedAt()

        );

        response.setUpdatedAt(

                workLog.getUpdatedAt()

        );

        return response;

    }

}