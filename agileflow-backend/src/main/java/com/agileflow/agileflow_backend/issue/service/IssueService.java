package com.agileflow.agileflow_backend.issue.service;

import com.agileflow.agileflow_backend.common.enums.IssuePriority;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.issue.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IssueService {

    IssueResponse create(
            CreateIssueRequest request);

    Page<IssueResponse> findByProject(
            Long projectId,
            Pageable pageable);

    Page<IssueResponse> search(
            Long projectId,
            String keyword,
            IssueStatus status,
            IssuePriority priority,
            Long assigneeId,
            Pageable pageable);

    List<IssueResponse> findBySprint(
            Long sprintId);

    List<IssueResponse> findByAssignee(
            Long userId);

    IssueResponse findById(
            Long id);

    IssueResponse update(
            Long id,
            UpdateIssueRequest request);

    void delete(
            Long id);

}