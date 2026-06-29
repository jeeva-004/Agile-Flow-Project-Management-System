package com.agileflow.agileflow_backend.issue.repository;

import com.agileflow.agileflow_backend.issue.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository
        extends JpaRepository<Issue, Long> {

    List<Issue> findByProjectId(
            Long projectId);

    List<Issue> findBySprintId(
            Long sprintId);

    List<Issue> findByAssigneeId(
            Long userId);

}