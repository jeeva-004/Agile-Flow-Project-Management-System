package com.agileflow.agileflow_backend.dashboard.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.dashboard.dto.AdminDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.DeveloperDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.ProjectManagerDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.service.DashboardService;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;

import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository userRepository;

    private final ProjectRepository projectRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final SprintRepository sprintRepository;

    private final IssueRepository issueRepository;

    private final CommentRepository commentRepository;

    private final WorkLogRepository workLogRepository;

    private final CurrentUserService currentUserService;

    public DashboardServiceImpl(

            UserRepository userRepository,

            ProjectRepository projectRepository,

            ProjectMemberRepository projectMemberRepository,

            SprintRepository sprintRepository,

            IssueRepository issueRepository,

            CommentRepository commentRepository,

            WorkLogRepository workLogRepository,

            CurrentUserService currentUserService

    ) {

        this.userRepository =
                userRepository;

        this.projectRepository =
                projectRepository;

        this.projectMemberRepository =
                projectMemberRepository;

        this.sprintRepository =
                sprintRepository;

        this.issueRepository =
                issueRepository;

        this.commentRepository =
                commentRepository;

        this.workLogRepository =
                workLogRepository;

        this.currentUserService =
                currentUserService;

    }

    @Override
    public AdminDashboardResponse adminDashboard() {

        AdminDashboardResponse response =
                new AdminDashboardResponse();

        response.setTotalUsers(

                userRepository.count()

        );

        response.setTotalProjects(

                projectRepository.count()

        );

        response.setTotalIssues(

                issueRepository.count()

        );

        response.setOpenIssues(

                issueRepository.countByStatus(

                        IssueStatus.TODO

                )

        );

        response.setCompletedIssues(

                issueRepository.countByStatus(

                        IssueStatus.DONE

                )

        );

        response.setTotalWorkLogs(

                workLogRepository.count()

        );

        return response;

    }

    @Override
    public ProjectManagerDashboardResponse pmDashboard() {

        User currentUser =

                currentUserService
                        .getCurrentUser();

        ProjectManagerDashboardResponse response =

                new ProjectManagerDashboardResponse();

        response.setManagedProjects(

                projectRepository.countByOwnerId(

                        currentUser.getId()

                )

        );

        response.setTeamMembers(

                projectMemberRepository
                        .countByProjectOwnerId(

                                currentUser.getId()

                        )

        );

        response.setActiveSprints(

                sprintRepository
                        .countByProjectOwnerId(

                                currentUser.getId()

                        )

        );

        response.setOpenIssues(

                issueRepository
                        .countByStatus(

                                IssueStatus.TODO

                        )

        );

        response.setCompletedIssues(

                issueRepository
                        .countByStatus(

                                IssueStatus.DONE

                        )

        );

        return response;

    }

    @Override
    public DeveloperDashboardResponse developerDashboard() {

        User currentUser =

                currentUserService
                        .getCurrentUser();

        DeveloperDashboardResponse response =

                new DeveloperDashboardResponse();

        response.setAssignedIssues(

                issueRepository
                        .countByAssigneeId(

                                currentUser.getId()

                        )

        );

        response.setCompletedIssues(

                issueRepository
                        .countByAssigneeIdAndStatus(

                                currentUser.getId(),

                                IssueStatus.DONE

                        )

        );

        response.setMyComments(

                commentRepository.countByAuthorId(

                        currentUser.getId()

                )

        );

        response.setMyWorkLogs(

                workLogRepository
                        .countByUserId(

                                currentUser.getId()

                        )

        );

        return response;

    }

}