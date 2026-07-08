package com.agileflow.agileflow_backend.issuehistory.repository;

import com.agileflow.agileflow_backend.issuehistory.entity.IssueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IssueHistoryRepository
        extends JpaRepository<IssueHistory,Long> {

    List<IssueHistory>

    findByIssueIdOrderByCreatedAtDesc(

            Long issueId

    );

    @Modifying
    @Transactional
    @Query("DELETE FROM IssueHistory h WHERE h.issue.id = :issueId")
    void deleteByIssueId(Long issueId);

}