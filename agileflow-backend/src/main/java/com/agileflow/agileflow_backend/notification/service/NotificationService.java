package com.agileflow.agileflow_backend.notification.service;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NotificationService {

    NotificationResponse create(

            User recipient,

            String title,

            String message,

            NotificationType type,

            String redirectUrl

    );

    Page<NotificationResponse>

    findMyNotifications(Pageable pageable);

    long unreadCount();

    void markAsRead(

            Long id

    );

    void markAllAsRead();

    void delete(

            Long id

    );

}