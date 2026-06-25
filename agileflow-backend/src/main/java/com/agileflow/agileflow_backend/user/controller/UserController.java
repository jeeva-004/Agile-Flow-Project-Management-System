package com.agileflow.agileflow_backend.user.controller;

import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.user.dto.CreateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UpdateUserRequest;
import com.agileflow.agileflow_backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {

        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<?> create(
            @Valid @RequestBody
            CreateUserRequest request) {

        return new ApiResponse<>(
                true,
                "User created successfully",
                userService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<?> findAll() {

        return new ApiResponse<>(
                true,
                "Users fetched successfully",
                userService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<?> findById(
            @PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "User fetched successfully",
                userService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<?> update(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateUserRequest request) {

        return new ApiResponse<>(
                true,
                "User updated successfully",
                userService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(
            @PathVariable Long id) {

        userService.delete(id);

        return new ApiResponse<>(
                true,
                "User deleted successfully",
                null
        );
    }
}