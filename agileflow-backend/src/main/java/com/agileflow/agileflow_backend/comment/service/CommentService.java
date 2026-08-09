package com.agileflow.agileflow_backend.comment.service;

import com.agileflow.agileflow_backend.comment.dto.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CommentService {

    CommentResponse create(

            Long issueId,

            CreateCommentRequest request

    );

    Page<CommentResponse>

    findByIssue(

            Long issueId,
            Pageable pageable

    );

    List<CommentResponse>

    findByIssue(

            Long issueId

    );

    CommentResponse findById(

            Long id

    );

    CommentResponse update(

            Long id,

            UpdateCommentRequest request

    );

    void delete(

            Long id

    );

}