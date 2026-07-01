package com.agileflow.agileflow_backend.comment.repository;

import com.agileflow.agileflow_backend.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment>

    findByIssueIdOrderByCreatedAtAsc(

            Long issueId

    );

    long countByAuthorId(

            Long userId

    );

}