package com.agileflow.agileflow_backend.worklog.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.worklog.dto.*;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import com.agileflow.agileflow_backend.worklog.service.WorkLogService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkLogServiceImpl
        implements WorkLogService {

    private final WorkLogRepository workLogRepository;
    private final IssueRepository issueRepository;
    private final CurrentUserService currentUserService;

    public WorkLogServiceImpl(
            WorkLogRepository workLogRepository,
            IssueRepository issueRepository,
            CurrentUserService currentUserService) {

        this.workLogRepository =
                workLogRepository;

        this.issueRepository =
                issueRepository;

        this.currentUserService =
                currentUserService;

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

        return map(

                workLog

        );

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