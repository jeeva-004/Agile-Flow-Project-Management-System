package com.agileflow.agileflow_backend.issue.service;

import com.agileflow.agileflow_backend.issue.dto.*;

import java.util.List;

public interface IssueService {

    IssueResponse create(
            CreateIssueRequest request);

    List<IssueResponse> findByProject(
            Long projectId);

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