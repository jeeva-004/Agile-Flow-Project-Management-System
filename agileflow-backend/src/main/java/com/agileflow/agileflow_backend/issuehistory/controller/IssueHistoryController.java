package com.agileflow.agileflow_backend.issuehistory.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.issuehistory.dto.IssueHistoryResponse;
import com.agileflow.agileflow_backend.issuehistory.service.IssueHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
public class IssueHistoryController {

    private final IssueHistoryService service;

    public IssueHistoryController(

            IssueHistoryService service

    ){

        this.service = service;

    }

    @GetMapping("/issues/{issueId}")
    public ResponseEntity<ApiResponse<List<IssueHistoryResponse>>>

    findByIssue(

            @PathVariable
            Long issueId

    ){

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Issue History",

                        service.findByIssue(

                                issueId

                        )

                )

        );

    }

}