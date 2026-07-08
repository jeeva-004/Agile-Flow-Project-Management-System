package com.agileflow.agileflow_backend.issue.service;

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