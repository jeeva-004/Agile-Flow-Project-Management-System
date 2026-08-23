package com.agileflow.agileflow_backend.dashboard.service.impl;

import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import com.agileflow.agileflow_backend.activity.entity.Activity;
import com.agileflow.agileflow_backend.activity.repository.ActivityRepository;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.dashboard.dto.AdminDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.DeveloperDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.ProjectCardDto;
import com.agileflow.agileflow_backend.dashboard.dto.ProjectManagerDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.service.DashboardService;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;
    private final CommentRepository commentRepository;
    private final WorkLogRepository workLogRepository;
    private final ActivityRepository activityRepository;
    private final CurrentUserService currentUserService;

    public DashboardServiceImpl(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            SprintRepository sprintRepository,
            IssueRepository issueRepository,
            CommentRepository commentRepository,
            WorkLogRepository workLogRepository,
            ActivityRepository activityRepository,
            CurrentUserService currentUserService
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.sprintRepository = sprintRepository;
        this.issueRepository = issueRepository;
        this.commentRepository = commentRepository;
        this.workLogRepository = workLogRepository;
        this.activityRepository = activityRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    public AdminDashboardResponse adminDashboard() {
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalProjects(projectRepository.count());
        response.setTotalIssues(issueRepository.count());
        response.setOpenIssues(issueRepository.countByStatus(IssueStatus.TODO));
        response.setCompletedIssues(issueRepository.countByStatus(IssueStatus.DONE));
        response.setTotalWorkLogs(workLogRepository.count());

        List<Project> allProjects = projectRepository.findAll();
        List<ProjectCardDto> activeProjectCards = allProjects.stream().map(this::buildProjectCard).toList();
        response.setActiveProjects(activeProjectCards);

        List<ActivityResponse> recentActivities = activityRepository.findTop20ByOrderByCreatedAtDesc()
                .stream().map(this::mapActivity).toList();
        response.setRecentActivities(recentActivities);

        return response;
    }

    @Override
    public ProjectManagerDashboardResponse pmDashboard() {
        User currentUser = currentUserService.getCurrentUser();

        ProjectManagerDashboardResponse response = new ProjectManagerDashboardResponse();
        response.setManagedProjects(projectRepository.countByOwnerId(currentUser.getId()));
        response.setTeamMembers(projectMemberRepository.countByProjectOwnerId(currentUser.getId()));
        response.setActiveSprints(sprintRepository.countByProjectOwnerId(currentUser.getId()));
        response.setOpenIssues(issueRepository.countByStatus(IssueStatus.TODO));
        response.setCompletedIssues(issueRepository.countByStatus(IssueStatus.DONE));

        List<Project> ownedProjects = projectRepository.findByOwnerId(currentUser.getId());
        List<ProjectMember> pmMemberships = projectMemberRepository.findByUserId(currentUser.getId());
        Set<Project> pmProjectsSet = new LinkedHashSet<>(ownedProjects);
        for (ProjectMember pm : pmMemberships) {
            if (pm.getProject() != null) {
                pmProjectsSet.add(pm.getProject());
            }
        }
        List<ProjectCardDto> pmProjectCards = pmProjectsSet.stream().map(this::buildProjectCard).toList();
        response.setActiveProjects(pmProjectCards);

        List<Long> projectIds = pmProjectsSet.stream().map(Project::getId).toList();
        List<ActivityResponse> pmActivities = projectIds.isEmpty() ? List.of() :
                activityRepository.findTop20ByProjectIdInOrderByCreatedAtDesc(projectIds)
                        .stream().map(this::mapActivity).toList();
        response.setRecentActivities(pmActivities);

        return response;
    }

    @Override
    public DeveloperDashboardResponse developerDashboard() {
        User currentUser = currentUserService.getCurrentUser();

        DeveloperDashboardResponse response = new DeveloperDashboardResponse();
        response.setAssignedIssues(issueRepository.countByAssigneeId(currentUser.getId()));
        response.setCompletedIssues(issueRepository.countByAssigneeIdAndStatus(currentUser.getId(), IssueStatus.DONE));
        response.setMyComments(commentRepository.countByAuthorId(currentUser.getId()));
        response.setMyWorkLogs(workLogRepository.countByUserId(currentUser.getId()));

        List<ProjectMember> devMemberships = projectMemberRepository.findByUserId(currentUser.getId());
        Set<Project> devProjectsSet = new LinkedHashSet<>();
        for (ProjectMember pm : devMemberships) {
            if (pm.getProject() != null) {
                devProjectsSet.add(pm.getProject());
            }
        }
        List<Issue> assignedIssues = issueRepository.findByAssigneeId(currentUser.getId());
        for (Issue issue : assignedIssues) {
            if (issue.getProject() != null) {
                devProjectsSet.add(issue.getProject());
            }
        }
        List<ProjectCardDto> devProjectCards = devProjectsSet.stream().map(this::buildProjectCard).toList();
        response.setActiveProjects(devProjectCards);

        List<Long> projectIds = devProjectsSet.stream().map(Project::getId).toList();
        List<ActivityResponse> devActivities = projectIds.isEmpty() ? List.of() :
                activityRepository.findTop20ByProjectIdInOrderByCreatedAtDesc(projectIds)
                        .stream().map(this::mapActivity).toList();
        response.setRecentActivities(devActivities);

        return response;
    }

    private ProjectCardDto buildProjectCard(Project project) {
        ProjectCardDto card = new ProjectCardDto();
        card.setId(project.getId());
        card.setName(project.getName());
        card.setDescription(project.getDescription());
        if (project.getOwner() != null) {
            card.setOwnerName(project.getOwner().getFirstName() + " " + project.getOwner().getLastName());
        }

        List<Issue> issues = issueRepository.findByProjectId(project.getId());
        card.setTotalIssues(issues.size());
        card.setCompletedIssues(issues.stream().filter(i -> i.getStatus() == IssueStatus.DONE).count());

        List<Sprint> sprints = sprintRepository.findByProjectId(project.getId());
        card.setTotalSprints(sprints.size());
        LocalDate now = LocalDate.now();
        card.setCompletedSprints(sprints.stream().filter(s -> s.getEndDate() != null && !s.getEndDate().isAfter(now)).count());

        List<WorkLog> workLogs = workLogRepository.findByIssueProjectId(project.getId());
        double totalHours = workLogs.stream().mapToDouble(wl -> wl.getHoursSpent() != null ? wl.getHoursSpent() : 0.0).sum();
        card.setTotalWorkLogHours(Math.round(totalHours * 10.0) / 10.0);

        List<ProjectMember> members = projectMemberRepository.findByProjectId(project.getId());
        Set<Long> userIds = new LinkedHashSet<>();
        if (project.getOwner() != null) {
            userIds.add(project.getOwner().getId());
        }
        for (ProjectMember pm : members) {
            if (pm.getUser() != null) {
                userIds.add(pm.getUser().getId());
            }
        }
        card.setTotalMembers(userIds.size());

        return card;
    }

    private ActivityResponse mapActivity(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setAction(activity.getAction());
        response.setMessage(activity.getMessage());
        response.setEntityType(activity.getEntityType());
        response.setEntityId(activity.getEntityId());
        if (activity.getUser() != null) {
            response.setUserId(activity.getUser().getId());
            response.setUserName(activity.getUser().getFirstName() + " " + activity.getUser().getLastName());
        }
        if (activity.getProject() != null) {
            response.setProjectId(activity.getProject().getId());
        }
        response.setCreatedAt(activity.getCreatedAt());
        return response;
    }
}