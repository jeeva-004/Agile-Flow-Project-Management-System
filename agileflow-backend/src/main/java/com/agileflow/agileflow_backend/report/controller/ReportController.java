package com.agileflow.agileflow_backend.report.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.report.dto.ProjectSummaryReport;
import com.agileflow.agileflow_backend.report.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ApiResponse<ProjectSummaryReport> getProjectSummaryReport(@PathVariable Long projectId) {
        return new ApiResponse<>(
                true,
                "Project summary report fetched successfully",
                reportService.getProjectSummaryReport(projectId)
        );
    }
}
