package com.agileflow.agileflow_backend.report.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.report.dto.ProjectSummaryReport;
import com.agileflow.agileflow_backend.report.service.ReportService;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReportServiceImpl implements ReportService {

    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;
    private final WorkLogRepository workLogRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ReportServiceImpl(
            ProjectRepository projectRepository,
            IssueRepository issueRepository,
            WorkLogRepository workLogRepository,
            ProjectMemberRepository projectMemberRepository) {

        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
        this.workLogRepository = workLogRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Override
    public ProjectSummaryReport getProjectSummaryReport(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        List<Issue> issues = issueRepository.findByProjectId(projectId);
        List<WorkLog> workLogs = workLogRepository.findByIssueProjectId(projectId);
        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);

        long totalIssues = issues.size();
        long completedIssues = issues.stream()
                .filter(i -> i.getStatus() == IssueStatus.DONE)
                .count();

        double completionPercentage = totalIssues == 0 ? 0.0 : ((double) completedIssues / totalIssues) * 100.0;

        double totalWorklogHours = workLogs.stream()
                .mapToDouble(wl -> wl.getHoursSpent() != null ? wl.getHoursSpent() : 0.0)
                .sum();

        // Get unique project users (owner + members)
        Set<User> allUsers = new LinkedHashSet<>();
        allUsers.add(project.getOwner());
        for (ProjectMember pm : members) {
            if (pm.getUser() != null) {
                allUsers.add(pm.getUser());
            }
        }

        List<ProjectSummaryReport.MemberContribution> contributions = new ArrayList<>();
        for (User user : allUsers) {
            long assignedCount = issues.stream()
                    .filter(i -> i.getAssignee() != null && i.getAssignee().getId().equals(user.getId()))
                    .count();

            double totalHours = workLogs.stream()
                    .filter(wl -> wl.getUser() != null && wl.getUser().getId().equals(user.getId()))
                    .mapToDouble(wl -> wl.getHoursSpent() != null ? wl.getHoursSpent() : 0.0)
                    .sum();

            contributions.add(new ProjectSummaryReport.MemberContribution(
                    user.getId(),
                    user.getFirstName() + " " + user.getLastName(),
                    assignedCount,
                    totalHours
            ));
        }

        return new ProjectSummaryReport(
                totalIssues,
                completedIssues,
                completionPercentage,
                totalWorklogHours,
                contributions
        );
    }
}
