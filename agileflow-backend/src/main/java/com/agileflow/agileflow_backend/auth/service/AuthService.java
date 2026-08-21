package com.agileflow.agileflow_backend.auth.service;

import com.agileflow.agileflow_backend.auth.dto.LoginRequest;
import com.agileflow.agileflow_backend.auth.dto.LoginResponse;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.exception.BadRequestException;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.security.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String token =
                jwtService.generateToken(user.getEmail());

        String role =
                user.getRoles()
                        .stream()
                        .findFirst()
                        .orElseThrow(() -> new BadRequestException("User has no assigned roles"))
                        .getName()
                        .name();

        return new LoginResponse(token, role);
    }
}