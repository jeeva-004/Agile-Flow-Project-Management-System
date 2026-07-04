package com.agileflow.agileflow_backend.notification.service;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse create(

            User recipient,

            String title,

            String message,

            NotificationType type,

            String redirectUrl

    );

    List<NotificationResponse>

    findMyNotifications();

    long unreadCount();

    void markAsRead(

            Long id

    );

    void markAllAsRead();

    void delete(

            Long id

    );

}