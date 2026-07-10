package com.agileflow.agileflow_backend.analytics.service;

import com.agileflow.agileflow_backend.analytics.dto.*;
import java.util.List;

public interface AnalyticsService {
    List<IssueStatusBreakdown> getIssuesByStatus(Long projectId);
    List<IssuePriorityBreakdown> getIssuesByPriority(Long projectId);
    List<SprintVelocity> getSprintVelocity(Long projectId);
    List<WorklogSummary> getWorklogSummary(Long projectId);
}
