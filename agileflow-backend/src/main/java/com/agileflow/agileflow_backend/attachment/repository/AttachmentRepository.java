package com.agileflow.agileflow_backend.attachment.repository;

import com.agileflow.agileflow_backend.attachment.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AttachmentRepository
        extends JpaRepository<Attachment,Long> {

    Page<Attachment> findByIssueId(Long issueId, Pageable pageable);

    List<Attachment>

    findByIssueId(

            Long issueId

    );

    boolean existsByIssueId(Long issueId);

}