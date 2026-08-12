package com.agileflow.agileflow_backend.user.service.impl;

import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.RoleRepository;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.UserStatus;
import com.agileflow.agileflow_backend.common.exception.BadRequestException;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.user.dto.CreateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UpdateUserRequest;
import com.agileflow.agileflow_backend.user.dto.UserResponse;
import com.agileflow.agileflow_backend.user.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse create(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Email already exists");
        }

        Set<Role> roles =
                roleRepository.findAllById(
                                request.getRoleIds())
                        .stream()
                        .collect(Collectors.toSet());

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setRoles(roles);

        return map(
                userRepository.save(user)
        );
    }

    @Override
    public Page<UserResponse> findAll(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(this::map);
    }

    @Override
    public UserResponse findById(Long id) {

        return map(
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"))
        );
    }

    @Override
    public UserResponse update(
            Long id,
            UpdateUserRequest request) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Set<Role> roles =
                roleRepository.findAllById(
                                request.getRoleIds())
                        .stream()
                        .collect(Collectors.toSet());

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setStatus(request.getStatus());
        user.setRoles(roles);

        return map(
                userRepository.save(user)
        );
    }

    @Override
    public void delete(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "User not found");
        }

        userRepository.deleteById(id);
    }

    private UserResponse map(User user) {

        UserResponse response =
                new UserResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setStatus(user.getStatus());

        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(role ->
                                role.getName().name())
                        .collect(Collectors.toSet()));

        return response;
    }
}