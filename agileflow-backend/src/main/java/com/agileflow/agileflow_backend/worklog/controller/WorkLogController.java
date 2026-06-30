package com.agileflow.agileflow_backend.worklog.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.worklog.dto.CreateWorkLogRequest;
import com.agileflow.agileflow_backend.worklog.dto.UpdateWorkLogRequest;
import com.agileflow.agileflow_backend.worklog.service.WorkLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class WorkLogController {

    private final WorkLogService workLogService;

    public WorkLogController(
            WorkLogService workLogService) {

        this.workLogService =
                workLogService;

    }

    @PostMapping(
            "/issues/{issueId}/worklogs"
    )
    public ApiResponse<?> create(

            @PathVariable
            Long issueId,

            @Valid

            @RequestBody

            CreateWorkLogRequest request

    ) {

        return ApiResponse.success(

                workLogService.create(

                        issueId,

                        request

                )

        );

    }

    @GetMapping(

            "/issues/{issueId}/worklogs"

    )
    public ApiResponse<?> findByIssue(

            @PathVariable

            Long issueId

    ) {

        return ApiResponse.success(

                workLogService.findByIssue(

                        issueId

                )

        );

    }

    @GetMapping(

            "/users/{userId}/worklogs"

    )
    public ApiResponse<?> findByUser(

            @PathVariable

            Long userId

    ) {

        return ApiResponse.success(

                workLogService.findByUser(

                        userId

                )

        );

    }

    @GetMapping(

            "/worklogs/{id}"

    )
    public ApiResponse<?> findById(

            @PathVariable

            Long id

    ) {

        return ApiResponse.success(

                workLogService.findById(

                        id

                )

        );

    }

    @PutMapping(

            "/worklogs/{id}"

    )
    public ApiResponse<?> update(

            @PathVariable

            Long id,

            @Valid

            @RequestBody

            UpdateWorkLogRequest request

    ) {

        return ApiResponse.success(

                workLogService.update(

                        id,

                        request

                )

        );

    }

    @DeleteMapping(

            "/worklogs/{id}"

    )
    public ApiResponse<?> delete(

            @PathVariable

            Long id

    ) {

        workLogService.delete(

                id

        );

        return ApiResponse.success(

                "Work log deleted"

        );

    }

}