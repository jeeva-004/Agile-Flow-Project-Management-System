package com.agileflow.agileflow_backend.notification.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/v1/notifications"
)
public class NotificationController {

    private final NotificationService
            notificationService;

    public NotificationController(

            NotificationService
                    notificationService

    ) {

        this.notificationService =

                notificationService;

    }

    @GetMapping
    public ApiResponse<List<NotificationResponse>>
    findMyNotifications() {

        return new ApiResponse<>(

                true,

                "Notifications fetched",

                notificationService

                        .findMyNotifications()

        );

    }

    @GetMapping(
            "/unread-count"
    )
    public ApiResponse<Long>
    unreadCount() {

        return new ApiResponse<>(

                true,

                "Unread count fetched",

                notificationService

                        .unreadCount()

        );

    }

    @PutMapping(
            "/{id}/read"
    )
    public ApiResponse<Void>
    markAsRead(

            @PathVariable
            Long id

    ) {

        notificationService

                .markAsRead(

                        id

                );

        return new ApiResponse<>(

                true,

                "Notification marked as read",

                null

        );

    }

    @PutMapping(
            "/read-all"
    )
    public ApiResponse<Void>
    markAllAsRead() {

        notificationService

                .markAllAsRead();

        return new ApiResponse<>(

                true,

                "All notifications marked as read",

                null

        );

    }

    @DeleteMapping(
            "/{id}"
    )
    public ApiResponse<Void>
    delete(

            @PathVariable
            Long id

    ) {

        notificationService.delete(

                id

        );

        return new ApiResponse<>(

                true,

                "Notification deleted",

                null

        );

    }

}