package com.agileflow.agileflow_backend.worklog.service;

import com.agileflow.agileflow_backend.worklog.dto.*;

import java.util.List;

public interface WorkLogService {

    WorkLogResponse create(

            Long issueId,

            CreateWorkLogRequest request

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