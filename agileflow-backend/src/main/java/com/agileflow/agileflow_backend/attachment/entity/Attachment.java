package com.agileflow.agileflow_backend.attachment.entity;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "attachments")
@Getter
@Setter
public class Attachment {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

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
            name = "uploaded_by",
            nullable = false
    )
    private User uploadedBy;

    private LocalDateTime uploadedAt;
    private byte[] data;

    @PrePersist
    public void prePersist(){

        uploadedAt =
                LocalDateTime.now();

    }

    public Attachment() {
    }

    // getters setters

}