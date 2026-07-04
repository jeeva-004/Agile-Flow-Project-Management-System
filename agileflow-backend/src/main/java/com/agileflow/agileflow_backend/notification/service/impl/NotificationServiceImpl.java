package com.agileflow.agileflow_backend.notification.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;
import com.agileflow.agileflow_backend.notification.entity.Notification;
import com.agileflow.agileflow_backend.notification.repository.NotificationRepository;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.util.List;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            CurrentUserService currentUserService) {

        this.notificationRepository =
                notificationRepository;

        this.currentUserService =
                currentUserService;

    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public NotificationResponse create(

            User recipient,

            String title,

            String message,

            NotificationType type,

            String redirectUrl

    ) {
        try {
            Notification notification =
                    new Notification();

            notification.setRecipient(

                    recipient
            );

            notification.setTitle(

                    title
            );

            notification.setMessage(

                    message
            );

            notification.setType(

                    type
            );

            notification.setRedirectUrl(

                    redirectUrl
            );

            notification.setIsRead(

                    false
            );

            notification =

                    notificationRepository.save(

                            notification
                    );

            return map(

                    notification
            );
        } catch (Exception e) {
            System.err.println("Notification creation failed: " + e.getMessage());
            return null;
        }

    }

    @Override
    public List<NotificationResponse>
    findMyNotifications() {

        User user =
                currentUserService
                        .getCurrentUser();

        return notificationRepository

                .findByRecipientIdOrderByCreatedAtDesc(

                        user.getId()

                )

                .stream()

                .map(

                        this::map

                )

                .toList();

    }

    @Override
    public long unreadCount() {

        User user =

                currentUserService
                        .getCurrentUser();

        return notificationRepository

                .countByRecipientIdAndIsReadFalse(

                        user.getId()

                );

    }

    @Override
    public void markAsRead(

            Long id

    ) {

        Notification notification =

                notificationRepository

                        .findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Notification not found"

                                )

                        );

        notification.setIsRead(

                true

        );

        notificationRepository.save(

                notification

        );

    }

    @Override
    public void markAllAsRead() {

        User user =

                currentUserService
                        .getCurrentUser();

        List<Notification> notifications =

                notificationRepository

                        .findByRecipientIdAndIsReadFalse(

                                user.getId()

                        );

        notifications.forEach(

                notification ->

                        notification.setIsRead(

                                true

                        )

        );

        notificationRepository.saveAll(

                notifications

        );

    }

    @Override
    public void delete(

            Long id

    ) {

        notificationRepository.deleteById(

                id

        );

    }

    private NotificationResponse map(

            Notification notification

    ) {

        NotificationResponse response =

                new NotificationResponse();

        response.setId(

                notification.getId()

        );

        response.setTitle(

                notification.getTitle()

        );

        response.setMessage(

                notification.getMessage()

        );

        response.setType(

                notification.getType()

                        .name()

        );

        response.setRead(

                notification.getIsRead()

        );

        response.setRedirectUrl(

                notification.getRedirectUrl()

        );

        response.setCreatedAt(

                notification.getCreatedAt()

        );

        return response;

    }

}