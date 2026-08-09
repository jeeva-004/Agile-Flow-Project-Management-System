package com.agileflow.agileflow_backend.sprint.service;

import com.agileflow.agileflow_backend.sprint.dto.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface SprintService {

    SprintResponse create(
            CreateSprintRequest request);

    Page<SprintResponse>
    findByProject(
            Long projectId,
            Pageable pageable);

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