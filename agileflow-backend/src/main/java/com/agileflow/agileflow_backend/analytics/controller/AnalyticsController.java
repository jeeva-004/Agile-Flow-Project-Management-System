package com.agileflow.agileflow_backend.analytics.controller;

import com.agileflow.agileflow_backend.analytics.dto.IssuePriorityBreakdown;
import com.agileflow.agileflow_backend.analytics.dto.IssueStatusBreakdown;
import com.agileflow.agileflow_backend.analytics.dto.SprintVelocity;
import com.agileflow.agileflow_backend.analytics.dto.WorklogSummary;
import com.agileflow.agileflow_backend.analytics.service.AnalyticsService;
import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/issues-by-status")
    public ApiResponse<List<IssueStatusBreakdown>> getIssuesByStatus(@PathVariable Long projectId) {
        return new ApiResponse<>(
                true,
                "Issues by status fetched successfully",
                analyticsService.getIssuesByStatus(projectId)
        );
    }

    @GetMapping("/issues-by-priority")
    public ApiResponse<List<IssuePriorityBreakdown>> getIssuesByPriority(@PathVariable Long projectId) {
        return new ApiResponse<>(
                true,
                "Issues by priority fetched successfully",
                analyticsService.getIssuesByPriority(projectId)
        );
    }

    @GetMapping("/sprint-velocity")
    public ApiResponse<List<SprintVelocity>> getSprintVelocity(@PathVariable Long projectId) {
        return new ApiResponse<>(
                true,
                "Sprint velocity fetched successfully",
                analyticsService.getSprintVelocity(projectId)
        );
    }

    @GetMapping("/worklog-summary")
    public ApiResponse<List<WorklogSummary>> getWorklogSummary(@PathVariable Long projectId) {
        return new ApiResponse<>(
                true,
                "Worklog summary fetched successfully",
                analyticsService.getWorklogSummary(projectId)
        );
    }
}
