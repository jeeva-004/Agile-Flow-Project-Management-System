package com.agileflow.agileflow_backend.config;

import com.agileflow.agileflow_backend.security.JwtAuthenticationEntryPoint;
import com.agileflow.agileflow_backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;

import java.util.List;
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter,
            JwtAuthenticationEntryPoint authenticationEntryPoint) {

        this.jwtFilter = jwtFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost",
                        "http://localhost:4200",
                        "https://agileflow-org.netlify.app"
                )
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setExposedHeaders(
                List.of("Authorization", "Link", "X-Total-Count")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                authenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/auth/test-users"
                        ).permitAll()
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/v1/users",
                                "/api/v1/users/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/users",
                                "/api/v1/users/**"
                        )
                        .hasRole("ADMIN")
                        // Specific sub-paths of /api/v1/projects/** MUST be declared
                        // before the broader /api/v1/projects/** matchers below,
                        // since Spring Security authorizes on a first-match-wins basis.
                        .requestMatchers(
                                "/api/v1/projects/*/analytics",
                                "/api/v1/projects/*/analytics/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                "/api/v1/projects/*/report",
                                "/api/v1/projects/*/report/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/v1/projects",
                                "/api/v1/projects/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/projects",
                                "/api/v1/projects/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/v1/project-members",
                                "/api/v1/project-members/**",
                                "/api/v1/projects/*/members",
                                "/api/v1/projects/*/members/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/project-members",
                                "/api/v1/project-members/**",
                                "/api/v1/projects/*/members",
                                "/api/v1/projects/*/members/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/v1/sprints",
                                "/api/v1/sprints/**",
                                "/api/v1/projects/*/sprints",
                                "/api/v1/projects/*/sprints/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/sprints",
                                "/api/v1/sprints/**",
                                "/api/v1/projects/*/sprints",
                                "/api/v1/projects/*/sprints/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                "/api/v1/issues",
                                "/api/v1/issues/**",
                                "/api/v1/projects/*/issues",
                                "/api/v1/projects/*/issues/**",
                                "/api/v1/sprints/*/issues",
                                "/api/v1/sprints/*/issues/**",
                                "/api/v1/users/*/issues",
                                "/api/v1/users/*/issues/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/comments",
                                "/api/v1/comments/**",
                                "/api/v1/issues/*/comments",
                                "/api/v1/issues/*/comments/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/worklogs",
                                "/api/v1/worklogs/**",
                                "/api/v1/issues/*/worklogs",
                                "/api/v1/issues/*/worklogs/**",
                                "/api/v1/users/*/worklogs",
                                "/api/v1/users/*/worklogs/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/notifications",
                                "/api/v1/notifications/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/attachments",
                                "/api/v1/attachments/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/history",
                                "/api/v1/history/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/activities",
                                "/api/v1/activities/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        // Specific /api/v1/dashboard/{role} matchers MUST be declared
                        // before the broader /api/v1/dashboard/** matcher below, for the
                        // same first-match-wins reason as the /api/v1/projects/** rules.
                        .requestMatchers(
                                "/api/v1/dashboard/admin"
                        )
                        .hasRole(
                                "ADMIN"
                        )
                        .requestMatchers(
                                "/api/v1/dashboard/pm"
                        )
                        .hasRole(
                                "PROJECT_MANAGER"
                        )
                        .requestMatchers(
                                "/api/v1/dashboard/developer"
                        )
                        .hasRole(
                                "DEVELOPER"
                        )
                        .requestMatchers(
                                "/api/v1/dashboard",
                                "/api/v1/dashboard/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PROJECT_MANAGER",
                                "DEVELOPER"
                        )
                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}