package com.agileflow.agileflow_backend.auth.repository;

import com.agileflow.agileflow_backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.agileflow.agileflow_backend.common.enums.RoleName;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) > 0 FROM User u JOIN u.roles r WHERE r.name = :roleName")
    boolean existsByRoleName(@Param("roleName") RoleName roleName);
}