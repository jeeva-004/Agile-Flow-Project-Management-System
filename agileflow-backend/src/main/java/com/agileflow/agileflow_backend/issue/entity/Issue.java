package com.agileflow.agileflow_backend.issue.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.enums.IssuePriority;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.enums.IssueType;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "issues")
@Getter
@Setter
public class Issue {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 255)
    private String title;

    @Column(
            columnDefinition = "TEXT")
    private String description;

    @Enumerated(
            EnumType.STRING)
    private IssueStatus status;

    @Enumerated(
            EnumType.STRING)
    private IssuePriority priority;

    @Enumerated(
            EnumType.STRING)
    private IssueType type;

    private Integer estimateHours;

    private LocalDate dueDate;

    @ManyToOne(
            fetch =
                    FetchType.LAZY)
    @JoinColumn(
            name = "project_id",
            nullable = false)
    private Project project;

    @ManyToOne(
            fetch =
                    FetchType.LAZY)
    @JoinColumn(
            name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(
            fetch =
                    FetchType.LAZY)
    @JoinColumn(
            name = "assignee_id")
    private User assignee;

    @ManyToOne(
            fetch =
                    FetchType.LAZY)
    @JoinColumn(
            name = "created_by",
            nullable = false)
    private User createdBy;

    // getters setters

}