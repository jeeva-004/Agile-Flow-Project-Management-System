package com.agileflow.agileflow_backend.issue.service.impl;

import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.attachment.repository.AttachmentRepository;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.common.enums.*;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.dto.*;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.issuehistory.service.IssueHistoryService;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IssueServiceImplTest {

    @Mock
    private IssueRepository issueRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private SprintRepository sprintRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CurrentUserService currentUserService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private WorkLogRepository workLogRepository;
    @Mock
    private ActivityService activityService;
    @Mock
    private IssueHistoryService issueHistoryService;
    @Mock
    private AttachmentRepository attachmentRepository;

    @InjectMocks
    private IssueServiceImpl issueService;

    private User createMockUser(Long id, String firstName, String lastName) {
        User user = new User();
        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return user;
    }

    private Project createMockProject(Long id, String name) {
        Project project = new Project();
        project.setId(id);
        project.setName(name);
        return project;
    }

    private Sprint createMockSprint(Long id, String name) {
        Sprint sprint = new Sprint();
        sprint.setId(id);
        sprint.setName(name);
        return sprint;
    }

    @Test
    void create_Success() {
        // Arrange
        CreateIssueRequest request = new CreateIssueRequest();
        request.setProjectId(1L);
        request.setSprintId(2L);
        request.setAssigneeId(3L);
        request.setTitle("Test Issue");
        request.setDescription("Test Description");
        request.setPriority(IssuePriority.HIGH);
        request.setType(IssueType.BUG);
        request.setEstimateHours(5);
        request.setDueDate(LocalDate.now().plusDays(5));

        Project project = createMockProject(1L, "Proj 1");
        Sprint sprint = createMockSprint(2L, "Sprint 1");
        User assignee = createMockUser(3L, "John", "Doe");
        User currentUser = createMockUser(4L, "Admin", "User");

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(sprintRepository.findById(2L)).thenReturn(Optional.of(sprint));
        when(userRepository.findById(3L)).thenReturn(Optional.of(assignee));
        when(currentUserService.getCurrentUser()).thenReturn(currentUser);

        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> {
            Issue issue = invocation.getArgument(0);
            issue.setId(10L);
            return issue;
        });

        // Act
        IssueResponse response = issueService.create(request);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Test Issue", response.getTitle());
        assertEquals(IssueStatus.TODO, response.getStatus());
        assertEquals(1L, response.getProjectId());
        assertEquals(2L, response.getSprintId());
        assertEquals(3L, response.getAssigneeId());
        assertEquals(4L, response.getCreatedById());

        verify(issueRepository).save(any(Issue.class));
        verify(activityService).create(eq(currentUser), eq(project), eq("CREATE_ISSUE"), anyString(), eq("ISSUE"), eq(10L));
        verify(issueHistoryService, times(3)).create(eq(currentUser), any(Issue.class), eq("CREATE"), anyString(), any(), any());
        verify(notificationService).create(eq(assignee), anyString(), anyString(), eq(NotificationType.ISSUE_ASSIGNED), anyString());
    }

    @Test
    void create_ProjectNotFound() {
        // Arrange
        CreateIssueRequest request = new CreateIssueRequest();
        request.setProjectId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> issueService.create(request));
        verify(issueRepository, never()).save(any());
    }

    @Test
    void findById_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User creator = createMockUser(4L, "Admin", "User");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(creator);

        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));

        // Act
        IssueResponse response = issueService.findById(10L);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Test Issue", response.getTitle());
        verify(issueRepository).findById(10L);
    }

    @Test
    void findById_NotFound() {
        // Arrange
        when(issueRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> issueService.findById(10L));
    }

    @Test
    void update_Success() {
        // Arrange
        UpdateIssueRequest request = new UpdateIssueRequest();
        request.setTitle("Updated Title");
        request.setStatus(IssueStatus.IN_PROGRESS);
        request.setPriority(IssuePriority.LOW);
        request.setAssigneeId(3L);
        request.setSprintId(2L);

        Project project = createMockProject(1L, "Proj 1");
        User oldAssignee = createMockUser(5L, "Old", "User");
        User newAssignee = createMockUser(3L, "John", "Doe");
        User currentUser = createMockUser(4L, "Admin", "User");
        Sprint sprint = createMockSprint(2L, "Sprint 2");

        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Original Title");
        issue.setStatus(IssueStatus.TODO);
        issue.setPriority(IssuePriority.MEDIUM);
        issue.setProject(project);
        issue.setCreatedBy(currentUser);
        issue.setAssignee(oldAssignee);

        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(sprintRepository.findById(2L)).thenReturn(Optional.of(sprint));
        when(userRepository.findById(3L)).thenReturn(Optional.of(newAssignee));
        when(currentUserService.getCurrentUser()).thenReturn(currentUser);
        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        IssueResponse response = issueService.update(10L, request);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
        assertEquals(IssueStatus.IN_PROGRESS, response.getStatus());
        assertEquals(IssuePriority.LOW, response.getPriority());

        verify(issueRepository).save(issue);
        verify(activityService).create(eq(currentUser), eq(project), eq("UPDATE_ISSUE"), anyString(), eq("ISSUE"), eq(10L));
        // Status changed, Priority changed, Assignee changed -> expect history service calls
        verify(issueHistoryService, atLeastOnce()).create(eq(currentUser), eq(issue), eq("UPDATE"), anyString(), any(), any());
        verify(notificationService).create(eq(newAssignee), eq("Issue Updated"), anyString(), eq(NotificationType.ISSUE_UPDATED), anyString());
    }

    @Test
    void update_NotFound() {
        // Arrange
        UpdateIssueRequest request = new UpdateIssueRequest();
        when(issueRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> issueService.update(10L, request));
    }

    @Test
    void delete_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User currentUser = createMockUser(4L, "Admin", "User");
        User assignee = createMockUser(3L, "John", "Doe");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(currentUser);
        issue.setAssignee(assignee);

        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(commentRepository.existsByIssueId(10L)).thenReturn(false);
        when(workLogRepository.existsByIssueId(10L)).thenReturn(false);
        when(attachmentRepository.existsByIssueId(10L)).thenReturn(false);
        when(currentUserService.getCurrentUser()).thenReturn(currentUser);

        // Act
        issueService.delete(10L);

        // Assert
        verify(issueRepository).delete(issue);
        verify(notificationService).create(eq(assignee), eq("Issue Deleted"), anyString(), eq(NotificationType.ISSUE_DELETED), eq("/issues"));
        verify(activityService).create(eq(currentUser), eq(project), eq("DELETE_ISSUE"), anyString(), eq("ISSUE"), eq(10L));
        verify(issueHistoryService).deleteByIssueId(10L);
    }

    @Test
    void delete_NotFound() {
        // Arrange
        when(issueRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> issueService.delete(10L));
    }

    @Test
    void delete_BlockedByComments() {
        // Arrange
        Issue issue = new Issue();
        issue.setId(10L);
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(commentRepository.existsByIssueId(10L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> issueService.delete(10L));
        assertEquals("Issue contains comments. Delete comments first.", exception.getMessage());
        verify(issueRepository, never()).delete(any(Issue.class));
    }

    @Test
    void delete_BlockedByWorklogs() {
        // Arrange
        Issue issue = new Issue();
        issue.setId(10L);
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(commentRepository.existsByIssueId(10L)).thenReturn(false);
        when(workLogRepository.existsByIssueId(10L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> issueService.delete(10L));
        assertEquals("Issue contains worklogs. Delete worklogs first.", exception.getMessage());
        verify(issueRepository, never()).delete(any(Issue.class));
    }

    @Test
    void delete_BlockedByAttachments() {
        // Arrange
        Issue issue = new Issue();
        issue.setId(10L);
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(commentRepository.existsByIssueId(10L)).thenReturn(false);
        when(workLogRepository.existsByIssueId(10L)).thenReturn(false);
        when(attachmentRepository.existsByIssueId(10L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> issueService.delete(10L));
        assertEquals("Issue contains attachments. Delete attachments first.", exception.getMessage());
        verify(issueRepository, never()).delete(any(Issue.class));
    }

    @Test
    void findByProject_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User creator = createMockUser(4L, "Admin", "User");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(creator);

        Page<Issue> page = new PageImpl<>(Collections.singletonList(issue));
        when(issueRepository.findByProjectId(eq(1L), any(Pageable.class))).thenReturn(page);

        // Act
        Page<IssueResponse> responsePage = issueService.findByProject(1L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Test Issue", responsePage.getContent().get(0).getTitle());
    }

    @Test
    void findBySprint_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User creator = createMockUser(4L, "Admin", "User");
        Sprint sprint = createMockSprint(2L, "Sprint 1");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(creator);
        issue.setSprint(sprint);

        when(issueRepository.findBySprintId(2L)).thenReturn(Collections.singletonList(issue));

        // Act
        List<IssueResponse> responseList = issueService.findBySprint(2L);

        // Assert
        assertNotNull(responseList);
        assertEquals(1, responseList.size());
        assertEquals("Test Issue", responseList.get(0).getTitle());
    }

    @Test
    void findByAssignee_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User creator = createMockUser(4L, "Admin", "User");
        User assignee = createMockUser(3L, "John", "Doe");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(creator);
        issue.setAssignee(assignee);

        when(issueRepository.findByAssigneeId(3L)).thenReturn(Collections.singletonList(issue));

        // Act
        List<IssueResponse> responseList = issueService.findByAssignee(3L);

        // Assert
        assertNotNull(responseList);
        assertEquals(1, responseList.size());
        assertEquals("Test Issue", responseList.get(0).getTitle());
    }

    @Test
    void search_Success() {
        // Arrange
        Project project = createMockProject(1L, "Proj 1");
        User creator = createMockUser(4L, "Admin", "User");
        Issue issue = new Issue();
        issue.setId(10L);
        issue.setTitle("Test Issue");
        issue.setProject(project);
        issue.setCreatedBy(creator);

        Page<Issue> page = new PageImpl<>(Collections.singletonList(issue));
        when(issueRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        // Act
        Page<IssueResponse> responsePage = issueService.search(1L, "keyword", IssueStatus.IN_PROGRESS, IssuePriority.HIGH, 3L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Test Issue", responsePage.getContent().get(0).getTitle());
    }
}
