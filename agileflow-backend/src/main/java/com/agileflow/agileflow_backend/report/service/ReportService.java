package com.agileflow.agileflow_backend.report.service;

import com.agileflow.agileflow_backend.report.dto.ProjectSummaryReport;

public interface ReportService {
    ProjectSummaryReport getProjectSummaryReport(Long projectId);
}
