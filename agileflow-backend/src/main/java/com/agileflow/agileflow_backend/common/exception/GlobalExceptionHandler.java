package com.agileflow.agileflow_backend.common.exception;

import com.agileflow.agileflow_backend.common.payload.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ErrorResponse(
                                false,
                                "Invalid email or password",
                                List.of()
                        )
                );
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabled(
            DisabledException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ErrorResponse(
                                false,
                                "User account is disabled",
                                List.of()
                        )
                );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ErrorResponse(
                                false,
                                ex.getMessage() != null ? ex.getMessage() : "Authentication failed",
                                List.of()
                        )
                );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(
                        new ErrorResponse(
                                false,
                                "Access denied: " + ex.getMessage(),
                                List.of()
                        )
                );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        List<String> errors =
                ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(fieldError ->
                                fieldError.getDefaultMessage())
                        .toList();

        return ResponseEntity.badRequest().body(
                new ErrorResponse(
                        false,
                        "Validation Failed",
                        errors
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        new ErrorResponse(
                                false,
                                ex.getMessage(),
                                List.of()
                        )
                );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        new ErrorResponse(
                                false,
                                ex.getMessage(),
                                List.of()
                        )
                );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException ex) {

        return ResponseEntity.badRequest()
                .body(
                        new ErrorResponse(
                                false,
                                ex.getMessage(),
                                List.of()
                        )
                );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex) {

        return ResponseEntity.badRequest()
                .body(
                        new ErrorResponse(
                                false,
                                ex.getMessage(),
                                List.of()
                        )
                );
    }
}