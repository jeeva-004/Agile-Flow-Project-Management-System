package com.agileflow.agileflow_backend.comment.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
public class Comment {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String message;

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
            name = "author_id",
            nullable = false
    )
    private User author;

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

    public Comment() {
    }


}