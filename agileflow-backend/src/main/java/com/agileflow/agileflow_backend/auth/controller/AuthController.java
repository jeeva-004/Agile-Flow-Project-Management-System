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
    private final com.agileflow.agileflow_backend.auth.repository.UserRepository userRepository;

    public AuthController(AuthService authService, com.agileflow.agileflow_backend.auth.repository.UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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

    @GetMapping("/test-users")
    public java.util.List<java.util.Map<String, Object>> testUsers() {
        return userRepository.findAll().stream().map(user -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("email", user.getEmail());
            map.put("firstName", user.getFirstName());
            map.put("lastName", user.getLastName());
            map.put("roles", user.getRoles().stream().map(r -> r.getName().name()).collect(java.util.stream.Collectors.toList()));
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }
}