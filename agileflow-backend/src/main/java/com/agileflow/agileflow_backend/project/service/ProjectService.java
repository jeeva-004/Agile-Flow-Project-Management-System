package com.agileflow.agileflow_backend.project.service;

import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.ProjectResponse;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;

import java.util.List;

public interface ProjectService {

    ProjectResponse create(
            CreateProjectRequest request);

    List<ProjectResponse> findAll();

    ProjectResponse findById(Long id);

    ProjectResponse update(
            Long id,
            UpdateProjectRequest request);

    void delete(Long id);

}