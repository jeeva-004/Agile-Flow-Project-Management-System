package com.agileflow.agileflow_backend.worklog.repository;

import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkLogRepository
        extends JpaRepository<WorkLog, Long> {

    List<WorkLog>

    findByIssueId(

            Long issueId

    );

    List<WorkLog>

    findByUserId(

            Long userId

    );

    long countByUserId(

            Long userId

    );

    boolean existsByIssueId(
            Long issueId
    );

    boolean existsByIssueProjectIdAndUserId(
            Long projectId,
            Long userId
    );
}