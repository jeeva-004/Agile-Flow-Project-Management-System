package com.agileflow.agileflow_backend.project.service.impl;

import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.ProjectResponse;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
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
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CurrentUserService currentUserService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private IssueRepository issueRepository;
    @Mock
    private ProjectMemberRepository projectMemberRepository;
    @Mock
    private SprintRepository sprintRepository;
    @Mock
    private ActivityService activityService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private User createMockUser(Long id, String firstName, String lastName) {
        User user = new User();
        user.setId(id);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return user;
    }

    @Test
    void create_Success() {
        // Arrange
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("New Project");
        request.setDescription("Desc");
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusMonths(3));
        request.setOwnerId(1L);

        User owner = createMockUser(1L, "Owner", "User");
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(currentUserService.getCurrentUser()).thenReturn(owner);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setId(100L);
            return p;
        });

        // Act
        ProjectResponse response = projectService.create(request);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("New Project", response.getName());
        assertEquals("Desc", response.getDescription());
        assertEquals(1L, response.getOwnerId());

        verify(projectRepository).save(any(Project.class));
        verify(notificationService).create(eq(owner), eq("Project Created"), anyString(), eq(NotificationType.PROJECT_CREATED), anyString());
        verify(activityService).create(eq(owner), any(Project.class), eq("CREATE_PROJECT"), anyString(), eq("PROJECT"), eq(100L));
    }

    @Test
    void findAll_Success() {
        // Arrange
        User owner = createMockUser(1L, "Owner", "User");
        Project project = new Project();
        project.setId(100L);
        project.setName("Project 1");
        project.setOwner(owner);

        Page<Project> page = new PageImpl<>(Collections.singletonList(project));
        when(projectRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        Page<ProjectResponse> responsePage = projectService.findAll(PageRequest.of(0, 10));

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Project 1", responsePage.getContent().get(0).getName());
        verify(projectRepository).findAll(any(Pageable.class));
    }

    @Test
    void search_Success() {
        // Arrange
        User owner = createMockUser(1L, "Owner", "User");
        Project project = new Project();
        project.setId(100L);
        project.setName("Search Project");
        project.setOwner(owner);

        Page<Project> page = new PageImpl<>(Collections.singletonList(project));
        when(projectRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        // Act
        Page<ProjectResponse> responsePage = projectService.search("keyword", 1L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Search Project", responsePage.getContent().get(0).getName());
    }

    @Test
    void findById_Success() {
        // Arrange
        User owner = createMockUser(1L, "Owner", "User");
        Project project = new Project();
        project.setId(100L);
        project.setName("Project 1");
        project.setOwner(owner);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));

        // Act
        ProjectResponse response = projectService.findById(100L);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Project 1", response.getName());
        verify(projectRepository).findById(100L);
    }

    @Test
    void findById_NotFound() {
        // Arrange
        when(projectRepository.findById(100L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> projectService.findById(100L));
    }

    @Test
    void update_Success() {
        // Arrange
        UpdateProjectRequest request = new UpdateProjectRequest();
        request.setName("Updated Project");
        request.setDescription("Updated Desc");
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusMonths(4));
        request.setOwnerId(2L);

        User oldOwner = createMockUser(1L, "Old", "Owner");
        User newOwner = createMockUser(2L, "New", "Owner");
        User currentUser = createMockUser(3L, "Admin", "User");

        Project project = new Project();
        project.setId(100L);
        project.setName("Old Project");
        project.setOwner(oldOwner);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newOwner));
        when(currentUserService.getCurrentUser()).thenReturn(currentUser);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        ProjectResponse response = projectService.update(100L, request);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Project", response.getName());
        assertEquals(2L, response.getOwnerId());

        verify(projectRepository).save(project);
        verify(notificationService).create(eq(newOwner), eq("Project Updated"), anyString(), eq(NotificationType.PROJECT_UPDATED), anyString());
        verify(activityService).create(eq(currentUser), eq(project), eq("UPDATE_PROJECT"), anyString(), eq("PROJECT"), eq(100L));
    }

    @Test
    void update_ProjectNotFound() {
        // Arrange
        UpdateProjectRequest request = new UpdateProjectRequest();
        when(projectRepository.findById(100L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> projectService.update(100L, request));
    }

    @Test
    void update_OwnerNotFound() {
        // Arrange
        UpdateProjectRequest request = new UpdateProjectRequest();
        request.setOwnerId(2L);

        Project project = new Project();
        project.setId(100L);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> projectService.update(100L, request));
    }

    @Test
    void delete_Success() {
        // Arrange
        User owner = createMockUser(1L, "Owner", "User");
        User currentUser = createMockUser(3L, "Admin", "User");

        Project project = new Project();
        project.setId(100L);
        project.setName("Project to Delete");
        project.setOwner(owner);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(issueRepository.existsByProjectId(100L)).thenReturn(false);
        when(sprintRepository.existsByProjectId(100L)).thenReturn(false);
        when(projectMemberRepository.existsByProjectId(100L)).thenReturn(false);
        when(currentUserService.getCurrentUser()).thenReturn(currentUser);

        // Act
        projectService.delete(100L);

        // Assert
        verify(projectRepository).delete(project);
        verify(notificationService).create(eq(owner), eq("Project Deleted"), anyString(), eq(NotificationType.PROJECT_DELETED), eq("/projects"));
        verify(activityService).create(eq(currentUser), eq(project), eq("DELETE_PROJECT"), anyString(), eq("PROJECT"), eq(100L));
    }

    @Test
    void delete_NotFound() {
        // Arrange
        when(projectRepository.findById(100L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> projectService.delete(100L));
    }

    @Test
    void delete_BlockedByIssues() {
        // Arrange
        Project project = new Project();
        project.setId(100L);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(issueRepository.existsByProjectId(100L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> projectService.delete(100L));
        assertEquals("Project contains issues. Delete issues first.", exception.getMessage());
        verify(projectRepository, never()).delete(any(Project.class));
    }

    @Test
    void delete_BlockedBySprints() {
        // Arrange
        Project project = new Project();
        project.setId(100L);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(issueRepository.existsByProjectId(100L)).thenReturn(false);
        when(sprintRepository.existsByProjectId(100L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> projectService.delete(100L));
        assertEquals("Project contains sprints.", exception.getMessage());
        verify(projectRepository, never()).delete(any(Project.class));
    }

    @Test
    void delete_BlockedByMembers() {
        // Arrange
        Project project = new Project();
        project.setId(100L);

        when(projectRepository.findById(100L)).thenReturn(Optional.of(project));
        when(issueRepository.existsByProjectId(100L)).thenReturn(false);
        when(sprintRepository.existsByProjectId(100L)).thenReturn(false);
        when(projectMemberRepository.existsByProjectId(100L)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> projectService.delete(100L));
        assertEquals("Project contains members.", exception.getMessage());
        verify(projectRepository, never()).delete(any(Project.class));
    }
}
