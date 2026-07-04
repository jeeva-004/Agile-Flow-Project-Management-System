package com.agileflow.agileflow_backend.notification.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(
            fetch =
                    FetchType.LAZY
    )
    @JoinColumn(
            name = "recipient_id",
            nullable = false
    )
    private User recipient;

    @Column(
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private NotificationType type;

    @Column(
            nullable = false
    )
    private Boolean isRead = false;

    @Column(
            length = 255
    )
    private String redirectUrl;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {

        createdAt =
                LocalDateTime.now();

    }

}