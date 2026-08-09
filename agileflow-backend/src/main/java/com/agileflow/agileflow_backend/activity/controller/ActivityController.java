package com.agileflow.agileflow_backend.activity.controller;

import com.agileflow.agileflow_backend.activity.dto.ActivityResponse;
import com.agileflow.agileflow_backend.activity.service.ActivityService;
import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(
        "/api/v1/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(

            ActivityService service){

        this.service =
                service;

    }

    @GetMapping(
            "/projects/{projectId}")

    public ResponseEntity<

            ApiResponse<

                    List<ActivityResponse>>>

    findByProject(

            @PathVariable
            Long projectId){

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Activities",

                        service.findByProject(

                                projectId)

                )

        );

    }

}