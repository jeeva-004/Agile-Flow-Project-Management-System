package com.agileflow.agileflow_backend.sprint.service.impl;

import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.sprint.dto.CreateSprintRequest;
import com.agileflow.agileflow_backend.sprint.dto.SprintResponse;
import com.agileflow.agileflow_backend.sprint.dto.UpdateSprintRequest;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.sprint.service.SprintService;
import org.springframework.stereotype.Service;

import java.util.List;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
@Service
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;
    private final IssueRepository issueRepository;

    public SprintServiceImpl(
            SprintRepository sprintRepository,
            ProjectRepository projectRepository,
            NotificationService notificationService,
            IssueRepository issueRepository) {

        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
        this.issueRepository = issueRepository;
    }

    @Override
    public SprintResponse create(
            CreateSprintRequest request) {

        Project project =
                projectRepository.findById(
                                request.getProjectId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Project not found"));

        Sprint sprint = new Sprint();

        sprint.setName(
                request.getName());

        sprint.setStartDate(
                request.getStartDate());

        sprint.setEndDate(
                request.getEndDate());

        sprint.setProject(
                project);

        sprint = sprintRepository.save(
                sprint);

        notificationService.create(

                project.getOwner(),

                "Sprint Created",

                "Sprint " + sprint.getName() + " created",

                NotificationType.SPRINT_CREATED,

                "/sprints/" + sprint.getId()

        );

        return map(
                sprint);

    }

    @Override
    public List<SprintResponse> findByProject(
            Long projectId) {

        return sprintRepository
                .findByProjectId(
                        projectId)
                .stream()
                .map(this::map)
                .toList();

    }

    @Override
    public SprintResponse findById(
            Long id) {

        Sprint sprint =
                sprintRepository.findById(
                                id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sprint not found"));

        return map(
                sprint);

    }

    @Override
    public SprintResponse update(
            Long id,
            UpdateSprintRequest request) {

        Sprint sprint =
                sprintRepository.findById(
                                id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sprint not found"));

        sprint.setName(
                request.getName());

        sprint.setStartDate(
                request.getStartDate());

        sprint.setEndDate(
                request.getEndDate());

        sprint = sprintRepository.save(
                sprint);
        notificationService.create(

                sprint.getProject().getOwner(),

                "Sprint Updated",

                "Sprint " + sprint.getName() + " updated",

                NotificationType.SPRINT_UPDATED,

                "/sprints/" + sprint.getId()

        );
        return map(
                sprint);

    }

    @Override
    public void delete(
            Long id) {

        Sprint sprint =
                sprintRepository.findById(
                                id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Sprint not found"));

        if (issueRepository.existsBySprintId(id)) {
            throw new IllegalArgumentException("Sprint contains issues. Delete issues first.");
        }

        notificationService.create(

                sprint.getProject().getOwner(),

                "Sprint Deleted",

                "Sprint " + sprint.getName() + " deleted",

                NotificationType.SPRINT_DELETED,

                "/sprints"

        );

        sprintRepository.delete(
                sprint);

    }

    private SprintResponse map(
            Sprint sprint) {

        SprintResponse response =
                new SprintResponse();

        response.setId(
                sprint.getId());

        response.setName(
                sprint.getName());

        response.setStartDate(
                sprint.getStartDate());

        response.setEndDate(
                sprint.getEndDate());

        response.setProjectId(
                sprint.getProject()
                        .getId());

        response.setProjectName(
                sprint.getProject()
                        .getName());

        return response;

    }

}