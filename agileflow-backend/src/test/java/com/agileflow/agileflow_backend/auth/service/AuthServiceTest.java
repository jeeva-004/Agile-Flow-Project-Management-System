package com.agileflow.agileflow_backend.auth.service;

import com.agileflow.agileflow_backend.auth.dto.LoginRequest;
import com.agileflow.agileflow_backend.auth.dto.LoginResponse;
import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.RoleName;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password");

        User user = new User();
        user.setEmail("user@example.com");
        Role role = new Role(1L, RoleName.DEVELOPER);
        user.setRoles(Collections.singleton(role));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("user@example.com")).thenReturn("mock-jwt-token");

        // Act
        LoginResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("DEVELOPER", response.getRole());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("user@example.com");
        verify(jwtService).generateToken("user@example.com");
    }

    @Test
    void login_UserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@example.com");
        request.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> authService.login(request));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail("unknown@example.com");
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void login_BadCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(userRepository);
        verifyNoInteractions(jwtService);
    }
}
