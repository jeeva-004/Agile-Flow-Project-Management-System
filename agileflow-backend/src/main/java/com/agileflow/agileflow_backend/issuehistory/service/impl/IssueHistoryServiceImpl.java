package com.agileflow.agileflow_backend.issuehistory.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issuehistory.dto.IssueHistoryResponse;
import com.agileflow.agileflow_backend.issuehistory.entity.IssueHistory;
import com.agileflow.agileflow_backend.issuehistory.repository.IssueHistoryRepository;
import com.agileflow.agileflow_backend.issuehistory.service.IssueHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueHistoryServiceImpl
        implements IssueHistoryService {

    private final IssueHistoryRepository repository;

    public IssueHistoryServiceImpl(

            IssueHistoryRepository repository

    ){

        this.repository =
                repository;

    }

    @Override
    public void create(

            User user,

            Issue issue,

            String action,

            String fieldName,

            String oldValue,

            String newValue

    ){

        IssueHistory history =

                new IssueHistory();

        history.setIssue(

                issue

        );

        history.setUser(

                user

        );

        history.setAction(

                action

        );

        history.setFieldName(

                fieldName

        );

        history.setOldValue(

                oldValue

        );

        history.setNewValue(

                newValue

        );

        repository.save(

                history

        );

    }

    @Override
    public List<IssueHistoryResponse>

    findByIssue(

            Long issueId

    ){

        return repository

                .findByIssueIdOrderByCreatedAtDesc(

                        issueId

                )

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public void deleteByIssueId(Long issueId) {
        repository.deleteByIssueId(issueId);
    }

    private IssueHistoryResponse map(

            IssueHistory history

    ){

        IssueHistoryResponse response =

                new IssueHistoryResponse();

        response.setId(

                history.getId()

        );

        response.setIssueId(

                history.getIssue()

                        .getId()

        );

        response.setUserId(

                history.getUser()

                        .getId()

        );

        response.setUserName(

                history.getUser()

                        .getFirstName()

                        + " "

                        +

                        history.getUser()

                                .getLastName()

        );

        response.setAction(

                history.getAction()

        );

        response.setFieldName(

                history.getFieldName()

        );

        response.setOldValue(

                history.getOldValue()

        );

        response.setNewValue(

                history.getNewValue()

        );

        response.setCreatedAt(

                history.getCreatedAt()

        );

        return response;

    }

}