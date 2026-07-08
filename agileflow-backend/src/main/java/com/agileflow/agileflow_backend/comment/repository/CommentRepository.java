package com.agileflow.agileflow_backend.comment.repository;

import com.agileflow.agileflow_backend.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    Page<Comment> findByIssueId(Long issueId, Pageable pageable);

    List<Comment>

    findByIssueIdOrderByCreatedAtAsc(

            Long issueId

    );

    long countByAuthorId(

            Long userId

    );

    boolean existsByIssueId(
            Long issueId
    );

    boolean existsByIssueProjectIdAndAuthorId(
            Long projectId,
            Long authorId
    );
}