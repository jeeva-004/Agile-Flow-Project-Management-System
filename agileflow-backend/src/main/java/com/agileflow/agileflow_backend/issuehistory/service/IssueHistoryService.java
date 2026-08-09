package com.agileflow.agileflow_backend.issuehistory.service;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issuehistory.dto.IssueHistoryResponse;

import java.util.List;

public interface IssueHistoryService {

    void create(

            User user,

            Issue issue,

            String action,

            String fieldName,

            String oldValue,

            String newValue

    );

    List<IssueHistoryResponse>

    findByIssue(

            Long issueId

    );

    void deleteByIssueId(Long issueId);

}