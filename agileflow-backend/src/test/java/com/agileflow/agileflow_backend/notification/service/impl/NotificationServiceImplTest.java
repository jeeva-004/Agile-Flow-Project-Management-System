package com.agileflow.agileflow_backend.notification.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;
import com.agileflow.agileflow_backend.notification.entity.Notification;
import com.agileflow.agileflow_backend.notification.repository.NotificationRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User createMockUser(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        return user;
    }

    private Notification createMockNotification(Long id, User recipient, String title, String message, boolean isRead) {
        Notification notification = new Notification();
        notification.setId(id);
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(NotificationType.ISSUE_ASSIGNED);
        notification.setIsRead(isRead);
        notification.setRedirectUrl("/redirect");
        notification.setCreatedAt(LocalDateTime.now());
        return notification;
    }

    @Test
    void create_Success() {
        // Arrange
        User recipient = createMockUser(1L, "user@example.com");
        Notification savedNotification = createMockNotification(10L, recipient, "Title", "Message", false);

        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        // Act
        NotificationResponse response = notificationService.create(recipient, "Title", "Message", NotificationType.ISSUE_ASSIGNED, "/redirect");

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Title", response.getTitle());
        assertEquals("Message", response.getMessage());
        assertEquals("ISSUE_ASSIGNED", response.getType());
        assertFalse(response.getRead());
        assertEquals("/redirect", response.getRedirectUrl());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void create_ExceptionReturnsNull() {
        // Arrange
        User recipient = createMockUser(1L, "user@example.com");
        when(notificationRepository.save(any(Notification.class))).thenThrow(new RuntimeException("Database error"));

        // Act
        NotificationResponse response = notificationService.create(recipient, "Title", "Message", NotificationType.ISSUE_ASSIGNED, "/redirect");

        // Assert
        assertNull(response);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void findMyNotifications_Success() {
        // Arrange
        User user = createMockUser(1L, "user@example.com");
        Notification notification = createMockNotification(10L, user, "Title", "Message", false);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        Page<Notification> page = new PageImpl<>(Collections.singletonList(notification));
        when(notificationRepository.findByRecipientId(eq(1L), any(Pageable.class))).thenReturn(page);

        // Act
        Page<NotificationResponse> responsePage = notificationService.findMyNotifications(PageRequest.of(0, 10));

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Title", responsePage.getContent().get(0).getTitle());
        verify(currentUserService).getCurrentUser();
        verify(notificationRepository).findByRecipientId(eq(1L), any(Pageable.class));
    }

    @Test
    void unreadCount_Success() {
        // Arrange
        User user = createMockUser(1L, "user@example.com");
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(notificationRepository.countByRecipientIdAndIsReadFalse(1L)).thenReturn(5L);

        // Act
        long count = notificationService.unreadCount();

        // Assert
        assertEquals(5L, count);
        verify(currentUserService).getCurrentUser();
        verify(notificationRepository).countByRecipientIdAndIsReadFalse(1L);
    }

    @Test
    void markAsRead_Success() {
        // Arrange
        User user = createMockUser(1L, "user@example.com");
        Notification notification = createMockNotification(10L, user, "Title", "Message", false);

        when(notificationRepository.findById(10L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        notificationService.markAsRead(10L);

        // Assert
        assertTrue(notification.getIsRead());
        verify(notificationRepository).findById(10L);
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAsRead_NotFound() {
        // Arrange
        when(notificationRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> notificationService.markAsRead(10L));
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void markAllAsRead_Success() {
        // Arrange
        User user = createMockUser(1L, "user@example.com");
        Notification n1 = createMockNotification(10L, user, "Title 1", "Message 1", false);
        Notification n2 = createMockNotification(11L, user, "Title 2", "Message 2", false);
        List<Notification> unreadList = Arrays.asList(n1, n2);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(notificationRepository.findByRecipientIdAndIsReadFalse(1L)).thenReturn(unreadList);

        // Act
        notificationService.markAllAsRead();

        // Assert
        assertTrue(n1.getIsRead());
        assertTrue(n2.getIsRead());
        verify(currentUserService).getCurrentUser();
        verify(notificationRepository).findByRecipientIdAndIsReadFalse(1L);
        verify(notificationRepository).saveAll(unreadList);
    }

    @Test
    void delete_Success() {
        // Arrange
        doNothing().when(notificationRepository).deleteById(10L);

        // Act
        notificationService.delete(10L);

        // Assert
        verify(notificationRepository).deleteById(10L);
    }
}
