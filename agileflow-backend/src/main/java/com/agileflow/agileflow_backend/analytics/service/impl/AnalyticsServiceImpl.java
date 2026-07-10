package com.agileflow.agileflow_backend.analytics.service.impl;

import com.agileflow.agileflow_backend.analytics.dto.*;
import com.agileflow.agileflow_backend.analytics.service.AnalyticsService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.IssuePriority;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;
    private final WorkLogRepository workLogRepository;

    public AnalyticsServiceImpl(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            SprintRepository sprintRepository,
            IssueRepository issueRepository,
            WorkLogRepository workLogRepository) {

        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.sprintRepository = sprintRepository;
        this.issueRepository = issueRepository;
        this.workLogRepository = workLogRepository;
    }

    @Override
    public List<IssueStatusBreakdown> getIssuesByStatus(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        List<Issue> issues = issueRepository.findByProjectId(projectId);

        java.util.Map<IssueStatus, Long> counts = new java.util.EnumMap<>(IssueStatus.class);
        for (IssueStatus status : IssueStatus.values()) {
            counts.put(status, 0L);
        }
        for (Issue issue : issues) {
            if (issue.getStatus() != null) {
                counts.put(issue.getStatus(), counts.get(issue.getStatus()) + 1);
            }
        }

        java.util.List<IssueStatusBreakdown> result = new java.util.ArrayList<>();
        for (java.util.Map.Entry<IssueStatus, Long> entry : counts.entrySet()) {
            result.add(new IssueStatusBreakdown(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    @Override
    public List<IssuePriorityBreakdown> getIssuesByPriority(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        List<Issue> issues = issueRepository.findByProjectId(projectId);

        java.util.Map<IssuePriority, Long> counts = new java.util.EnumMap<>(IssuePriority.class);
        for (IssuePriority priority : IssuePriority.values()) {
            counts.put(priority, 0L);
        }
        for (Issue issue : issues) {
            if (issue.getPriority() != null) {
                counts.put(issue.getPriority(), counts.get(issue.getPriority()) + 1);
            }
        }

        java.util.List<IssuePriorityBreakdown> result = new java.util.ArrayList<>();
        for (java.util.Map.Entry<IssuePriority, Long> entry : counts.entrySet()) {
            result.add(new IssuePriorityBreakdown(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    @Override
    public List<SprintVelocity> getSprintVelocity(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with id: " + projectId);
        }
        List<Sprint> sprints = sprintRepository.findByProjectId(projectId);
        java.util.List<SprintVelocity> result = new java.util.ArrayList<>();
        for (Sprint sprint : sprints) {
            List<Issue> issues = issueRepository.findBySprintId(sprint.getId());
            long planned = issues.size();
            long completed = issues.stream()
                    .filter(i -> i.getStatus() == IssueStatus.DONE)
                    .count();
            result.add(new SprintVelocity(sprint.getId(), sprint.getName(), planned, completed));
        }
        return result;
    }

    @Override
    public List<WorklogSummary> getWorklogSummary(Long projectId) {
        com.agileflow.agileflow_backend.project.entity.Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);

        java.util.Set<User> allProjectUsers = new java.util.LinkedHashSet<>();
        allProjectUsers.add(project.getOwner());
        for (ProjectMember pm : members) {
            if (pm.getUser() != null) {
                allProjectUsers.add(pm.getUser());
            }
        }

        java.util.Map<Long, WorklogSummary> summaryMap = new java.util.LinkedHashMap<>();
        for (User user : allProjectUsers) {
            WorklogSummary summary = new WorklogSummary();
            summary.setUserId(user.getId());
            summary.setUserName(user.getFirstName() + " " + user.getLastName());
            summary.setAverageHours(0.0);
            summary.setTotalHours(0.0);
            summaryMap.put(user.getId(), summary);
        }

        List<WorkLog> workLogs = workLogRepository.findByIssueProjectId(projectId);
        java.util.Map<Long, java.util.List<WorkLog>> logsByUserId = workLogs.stream()
                .filter(wl -> wl.getUser() != null)
                .collect(java.util.stream.Collectors.groupingBy(wl -> wl.getUser().getId()));

        for (java.util.Map.Entry<Long, java.util.List<WorkLog>> entry : logsByUserId.entrySet()) {
            Long userId = entry.getKey();
            java.util.List<WorkLog> userLogs = entry.getValue();

            double total = userLogs.stream()
                    .mapToDouble(wl -> wl.getHoursSpent() != null ? wl.getHoursSpent() : 0.0)
                    .sum();
            double average = userLogs.isEmpty() ? 0.0 : total / userLogs.size();

            WorklogSummary summary = summaryMap.get(userId);
            if (summary == null) {
                summary = new WorklogSummary();
                summary.setUserId(userId);
                User user = userLogs.get(0).getUser();
                summary.setUserName(user.getFirstName() + " " + user.getLastName());
                summaryMap.put(userId, summary);
            }
            summary.setTotalHours(total);
            summary.setAverageHours(average);
        }

        return new java.util.ArrayList<>(summaryMap.values());
    }
}
