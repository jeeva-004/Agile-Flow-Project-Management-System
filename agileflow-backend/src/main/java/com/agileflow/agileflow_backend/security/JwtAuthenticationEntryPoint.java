package com.agileflow.agileflow_backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.agileflow.agileflow_backend.common.payload.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationEntryPoint
        implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException)
            throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ErrorResponse error =
                new ErrorResponse(
                        false,
                        "Unauthorized",
                        List.of("Authentication required")
                );

        new ObjectMapper().writeValue(
                response.getOutputStream(),
                error
        );
    }
}