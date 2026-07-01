package com.agileflow.agileflow_backend.dashboard.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(

            DashboardService service

    ) {

        this.service = service;

    }

    @GetMapping(

            "/admin"

    )
    public ApiResponse<?> admin() {

        return new ApiResponse<>(

                true,

                "Admin dashboard",

                service.adminDashboard()

        );

    }

    @GetMapping(

            "/pm"

    )
    public ApiResponse<?> pm() {

        return new ApiResponse<>(

                true,

                "PM dashboard",

                service.pmDashboard()

        );

    }

    @GetMapping(

            "/developer"

    )
    public ApiResponse<?> developer() {

        return new ApiResponse<>(

                true,

                "Developer dashboard",

                service.developerDashboard()

        );

    }

}