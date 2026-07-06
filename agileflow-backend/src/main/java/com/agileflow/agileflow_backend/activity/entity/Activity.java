package com.agileflow.agileflow_backend.activity.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.project.entity.Project;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private String action;

    @Column(length = 1000)
    private String message;

    private String entityType;

    private Long entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id"
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "project_id"
    )
    private Project project;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist(){

        createdAt =
                LocalDateTime.now();

    }

}