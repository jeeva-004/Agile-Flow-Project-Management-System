package com.agileflow.agileflow_backend.project.service;

import com.agileflow.agileflow_backend.project.dto.CreateProjectRequest;
import com.agileflow.agileflow_backend.project.dto.ProjectResponse;
import com.agileflow.agileflow_backend.project.dto.UpdateProjectRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    ProjectResponse create(
            CreateProjectRequest request);

    Page<ProjectResponse> findAll(Pageable pageable);

    ProjectResponse findById(Long id);

    ProjectResponse update(
            Long id,
            UpdateProjectRequest request);

    void delete(Long id);

}