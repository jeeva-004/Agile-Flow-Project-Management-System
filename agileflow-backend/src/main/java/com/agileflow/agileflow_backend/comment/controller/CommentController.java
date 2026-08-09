package com.agileflow.agileflow_backend.comment.controller;

import com.agileflow.agileflow_backend.comment.dto.CreateCommentRequest;
import com.agileflow.agileflow_backend.comment.dto.UpdateCommentRequest;
import com.agileflow.agileflow_backend.comment.service.CommentService;
import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class CommentController {

    private final CommentService service;

    public CommentController(

            CommentService service) {

        this.service = service;

    }

    @PostMapping(

            "/issues/{issueId}/comments")

    public ApiResponse<?> create(

            @PathVariable

            Long issueId,

            @Valid

            @RequestBody

            CreateCommentRequest request) {

        return new ApiResponse<>(

                true,

                "Comment created successfully",

                service.create(

                        issueId,

                        request));

    }

    @GetMapping(

            "/issues/{issueId}/comments")

    public ApiResponse<?> findByIssue(

            @PathVariable

            Long issueId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        if (page != null && size != null) {
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            return new ApiResponse<>(
                    true,
                    "Comments fetched successfully",
                    service.findByIssue(issueId, pageable));
        }

        return new ApiResponse<>(

                true,

                "Comments fetched successfully",

                service.findByIssue(

                        issueId));

    }

    @GetMapping(

            "/comments/{id}")

    public ApiResponse<?> findById(

            @PathVariable

            Long id) {

        return new ApiResponse<>(

                true,

                "Comment fetched successfully",

                service.findById(

                        id));

    }

    @PutMapping(

            "/comments/{id}")

    public ApiResponse<?> update(

            @PathVariable

            Long id,

            @Valid

            @RequestBody

            UpdateCommentRequest request) {

        return new ApiResponse<>(

                true,

                "Comment updated successfully",

                service.update(

                        id,

                        request));

    }

    @DeleteMapping(

            "/comments/{id}")

    public ApiResponse<?> delete(

            @PathVariable

            Long id) {

        service.delete(

                id);

        return new ApiResponse<>(

                true,

                "Comment deleted successfully",

                null);

    }

}