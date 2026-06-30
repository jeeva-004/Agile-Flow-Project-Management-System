package com.agileflow.agileflow_backend.comment.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.comment.dto.CommentResponse;
import com.agileflow.agileflow_backend.comment.dto.CreateCommentRequest;
import com.agileflow.agileflow_backend.comment.dto.UpdateCommentRequest;
import com.agileflow.agileflow_backend.comment.entity.Comment;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.comment.service.CommentService;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl
        implements CommentService {

    private final CommentRepository commentRepository;

    private final IssueRepository issueRepository;

    private final UserRepository userRepository;

    private final CurrentUserService currentUserService;

    public CommentServiceImpl(

            CommentRepository commentRepository,

            IssueRepository issueRepository,

            UserRepository userRepository,

            CurrentUserService currentUserService) {

        this.commentRepository =
                commentRepository;

        this.issueRepository =
                issueRepository;

        this.userRepository =
                userRepository;

        this.currentUserService = currentUserService;
    }

    @Override
    public CommentResponse create(

            Long issueId,

            CreateCommentRequest request) {

        Issue issue =

                issueRepository.findById(

                                issueId)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Issue not found"));

        User author =

                currentUserService

                        .getCurrentUser();
        Comment comment =

                new Comment();

        comment.setMessage(

                request.getMessage());

        comment.setIssue(

                issue);

        comment.setAuthor(

                author);

        comment =

                commentRepository.save(

                        comment);

        return map(

                comment);

    }

    @Override
    public List<CommentResponse>

    findByIssue(

            Long issueId) {

        return commentRepository

                .findByIssueIdOrderByCreatedAtAsc(

                        issueId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public CommentResponse findById(

            Long id) {

        Comment comment =

                commentRepository.findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Comment not found"));

        return map(

                comment);

    }

    @Override
    public CommentResponse update(

            Long id,

            UpdateCommentRequest request) {

        Comment comment =

                commentRepository.findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Comment not found"));

        comment.setMessage(

                request.getMessage());

        comment =

                commentRepository.save(

                        comment);

        return map(

                comment);

    }

    @Override
    public void delete(

            Long id) {

        Comment comment =

                commentRepository.findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Comment not found"));

        commentRepository.delete(

                comment);

    }

    private CommentResponse map(

            Comment comment) {

        CommentResponse response =

                new CommentResponse();

        response.setId(

                comment.getId());

        response.setMessage(

                comment.getMessage());

        response.setIssueId(

                comment.getIssue()

                        .getId());

        response.setAuthorId(

                comment.getAuthor()

                        .getId());

        response.setAuthorName(

                comment.getAuthor()

                        .getFirstName()

                        + " "

                        +

                        comment.getAuthor()

                                .getLastName());

        response.setCreatedAt(

                comment.getCreatedAt());

        response.setUpdatedAt(

                comment.getUpdatedAt());

        return response;

    }

}