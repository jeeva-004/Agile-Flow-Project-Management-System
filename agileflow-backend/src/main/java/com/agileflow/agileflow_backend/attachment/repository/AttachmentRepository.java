package com.agileflow.agileflow_backend.attachment.repository;

import com.agileflow.agileflow_backend.attachment.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository
        extends JpaRepository<Attachment,Long> {

    List<Attachment>

    findByIssueId(

            Long issueId

    );

}