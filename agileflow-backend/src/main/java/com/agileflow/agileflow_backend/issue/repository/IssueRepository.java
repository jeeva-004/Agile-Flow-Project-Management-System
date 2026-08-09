package com.agileflow.agileflow_backend.issue.repository;

import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface IssueRepository
        extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {

    List<Issue> findByProjectId(
            Long projectId);

    Page<Issue> findByProjectId(
            Long projectId,
            Pageable pageable);

    List<Issue> findBySprintId(
            Long sprintId);

    List<Issue> findByAssigneeId(
            Long userId);

    long countByStatus(IssueStatus status);

    long countByAssigneeId(
            Long assigneeId
    );

    long countByAssigneeIdAndStatus(
            Long assigneeId,
            IssueStatus status
    );

    boolean existsByProjectId(
            Long projectId
    );

    boolean existsBySprintId(
            Long sprintId
    );

    boolean existsByProjectIdAndAssigneeId(
            Long projectId,
            Long assigneeId
    );

    boolean existsByProjectIdAndCreatedById(
            Long projectId,
            Long createdById
    );
}