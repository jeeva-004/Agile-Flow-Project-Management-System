package com.agileflow.agileflow_backend.notification.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.notification.dto.NotificationResponse;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ApiResponse<Page<NotificationResponse>>
    findMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return new ApiResponse<>(

                true,

                "Notifications fetched",

                notificationService

                        .findMyNotifications(pageable)

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