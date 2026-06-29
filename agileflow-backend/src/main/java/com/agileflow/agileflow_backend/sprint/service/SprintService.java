package com.agileflow.agileflow_backend.sprint.service;

import com.agileflow.agileflow_backend.sprint.dto.*;

import java.util.List;

public interface SprintService {

    SprintResponse create(
            CreateSprintRequest request);

    List<SprintResponse>
    findByProject(
            Long projectId);

    SprintResponse findById(
            Long id);

    SprintResponse update(
            Long id,
            UpdateSprintRequest request);

    void delete(
            Long id);

}