package com.agileflow.agileflow_backend.worklog.service;

import com.agileflow.agileflow_backend.worklog.dto.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface WorkLogService {

    WorkLogResponse create(

            Long issueId,

            CreateWorkLogRequest request

    );

    Page<WorkLogResponse>

    findByIssue(

            Long issueId,
            Pageable pageable

    );

    Page<WorkLogResponse>

    findByUser(

            Long userId,
            Pageable pageable

    );

    List<WorkLogResponse>

    findByIssue(

            Long issueId

    );

    List<WorkLogResponse>

    findByUser(

            Long userId

    );

    WorkLogResponse findById(

            Long id

    );

    WorkLogResponse update(

            Long id,

            UpdateWorkLogRequest request

    );

    void delete(

            Long id

    );

}