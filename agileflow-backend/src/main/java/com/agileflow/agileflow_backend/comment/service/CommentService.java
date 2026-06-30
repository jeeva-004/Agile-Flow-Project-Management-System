package com.agileflow.agileflow_backend.comment.service;

import com.agileflow.agileflow_backend.comment.dto.*;

import java.util.List;

public interface CommentService {

    CommentResponse create(

            Long issueId,

            CreateCommentRequest request

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