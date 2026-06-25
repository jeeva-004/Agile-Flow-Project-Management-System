package com.agileflow.agileflow_backend.auth.controller;

import com.agileflow.agileflow_backend.auth.dto.LoginRequest;
import com.agileflow.agileflow_backend.auth.service.AuthService;
import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<?> login(
            @Valid @RequestBody LoginRequest request) {

        return new ApiResponse<>(
                true,
                "Login successful",
                authService.login(request)
        );
    }
}