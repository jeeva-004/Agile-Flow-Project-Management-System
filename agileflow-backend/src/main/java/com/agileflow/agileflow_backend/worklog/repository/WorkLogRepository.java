package com.agileflow.agileflow_backend.worklog.repository;

import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface WorkLogRepository
        extends JpaRepository<WorkLog, Long> {

    Page<WorkLog> findByIssueId(Long issueId, Pageable pageable);

    Page<WorkLog> findByUserId(Long userId, Pageable pageable);

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