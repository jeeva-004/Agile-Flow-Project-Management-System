package com.agileflow.agileflow_backend.activity.service.impl;

import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import com.agileflow.agileflow_backend.activity.entity.Activity;
import com.agileflow.agileflow_backend.activity.repository.ActivityRepository;
import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.project.entity.Project;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityServiceImpl
        implements ActivityService {

    private final ActivityRepository repository;

    public ActivityServiceImpl(

            ActivityRepository repository

    ){

        this.repository =
                repository;

    }

    @Override
    public void create(

            User user,

            Project project,

            String action,

            String message,

            String entityType,

            Long entityId

    ){

        Activity activity =

                new Activity();

        activity.setUser(

                user);

        activity.setProject(

                project);

        activity.setAction(

                action);

        activity.setMessage(

                message);

        activity.setEntityType(

                entityType);

        activity.setEntityId(

                entityId);

        repository.save(

                activity);

    }

    @Override
    public List<ActivityResponse>

    findByProject(

            Long projectId){

        return repository

                .findByProjectIdOrderByCreatedAtDesc(

                        projectId)

                .stream()

                .map(this::map)

                .toList();

    }

    private ActivityResponse map(

            Activity activity){

        ActivityResponse response =

                new ActivityResponse();

        response.setId(

                activity.getId());

        response.setAction(

                activity.getAction());

        response.setMessage(

                activity.getMessage());

        response.setEntityType(

                activity.getEntityType());

        response.setEntityId(

                activity.getEntityId());

        response.setUserId(

                activity.getUser()

                        .getId());

        response.setUserName(

                activity.getUser()

                        .getFirstName()

                        +" "+

                        activity.getUser()

                                .getLastName());

        response.setProjectId(

                activity.getProject()

                        .getId());

        response.setCreatedAt(

                activity.getCreatedAt());

        return response;

    }

}