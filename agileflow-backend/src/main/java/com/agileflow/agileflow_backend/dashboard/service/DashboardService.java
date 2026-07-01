package com.agileflow.agileflow_backend.dashboard.service;

import com.agileflow.agileflow_backend.dashboard.dto.AdminDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.DeveloperDashboardResponse;
import com.agileflow.agileflow_backend.dashboard.dto.ProjectManagerDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse adminDashboard();

    ProjectManagerDashboardResponse pmDashboard();

    DeveloperDashboardResponse developerDashboard();

}