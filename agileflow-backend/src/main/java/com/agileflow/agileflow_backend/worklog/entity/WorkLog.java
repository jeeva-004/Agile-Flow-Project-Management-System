package com.agileflow.agileflow_backend.worklog.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_logs")
@Getter
@Setter
public class WorkLog {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "issue_id",
            nullable = false
    )
    private Issue issue;

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(
            nullable = false
    )
    private Double hoursSpent;

    @Column(
            columnDefinition = "TEXT"
    )
    private String description;

    private LocalDate workDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {

        createdAt =
                LocalDateTime.now();

        updatedAt =
                LocalDateTime.now();

    }

    @PreUpdate
    public void onUpdate() {

        updatedAt =
                LocalDateTime.now();

    }

    public WorkLog() {
    }

    // getters setters

}