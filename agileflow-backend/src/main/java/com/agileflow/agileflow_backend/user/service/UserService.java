package com.agileflow.agileflow_backend.user.service;

import com.agileflow.agileflow_backend.user.dto.CreateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UpdateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UserResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface UserService {

    UserResponse create(CreateUserRequest request);

    Page<UserResponse> findAll(Pageable pageable);

    UserResponse findById(Long id);

    UserResponse update(Long id, UpdateUserRequest request);

    void delete(Long id);
}