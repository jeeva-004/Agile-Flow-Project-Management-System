package com.agileflow.agileflow_backend.notification.repository;

import com.agileflow.agileflow_backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);

    List<Notification>

    findByRecipientIdOrderByCreatedAtDesc(

            Long recipientId

    );

    List<Notification>

    findByRecipientIdAndIsReadFalse(

            Long recipientId

    );

    long countByRecipientIdAndIsReadFalse(

            Long recipientId

    );

}