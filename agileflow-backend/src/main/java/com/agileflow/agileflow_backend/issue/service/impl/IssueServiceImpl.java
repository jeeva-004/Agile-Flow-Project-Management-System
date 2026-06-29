package com.agileflow.agileflow_backend.issue.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.dto.*;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.issue.service.IssueService;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueServiceImpl
        implements IssueService {

    private final IssueRepository issueRepository;

    private final ProjectRepository projectRepository;

    private final SprintRepository sprintRepository;

    private final UserRepository userRepository;

    public IssueServiceImpl(

            IssueRepository issueRepository,

            ProjectRepository projectRepository,

            SprintRepository sprintRepository,

            UserRepository userRepository) {

        this.issueRepository =
                issueRepository;

        this.projectRepository =
                projectRepository;

        this.sprintRepository =
                sprintRepository;

        this.userRepository =
                userRepository;

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

                userRepository.findById(

                                1L)

                        .orElseThrow();

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

        return map(

                issue);

    }

    @Override
    public List<IssueResponse>

    findByProject(

            Long projectId) {

        return issueRepository

                .findByProjectId(

                        projectId)

                .stream()

                .map(this::map)

                .toList();

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

        return map(

                issue);

    }

    @Override
    public void delete(

            Long id) {

        Issue issue =

                issueRepository

                        .findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Issue not found"));

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