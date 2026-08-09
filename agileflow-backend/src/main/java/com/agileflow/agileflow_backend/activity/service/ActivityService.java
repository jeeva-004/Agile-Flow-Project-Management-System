package com.agileflow.agileflow_backend.activity.service;

import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.project.entity.Project;

import java.util.List;

public interface ActivityService {

    void create(

            User user,

            Project project,

            String action,

            String message,

            String entityType,

            Long entityId

    );

    List<ActivityResponse>
    findByProject(

            Long projectId

    );

}