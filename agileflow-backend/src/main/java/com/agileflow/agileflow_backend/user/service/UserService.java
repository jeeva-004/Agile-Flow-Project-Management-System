package com.agileflow.agileflow_backend.user.service;

import com.agileflow.agileflow_backend.user.dto.CreateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UpdateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse create(CreateUserRequest request);

    List<UserResponse> findAll();

    UserResponse findById(Long id);

    UserResponse update(Long id, UpdateUserRequest request);

    void delete(Long id);
}