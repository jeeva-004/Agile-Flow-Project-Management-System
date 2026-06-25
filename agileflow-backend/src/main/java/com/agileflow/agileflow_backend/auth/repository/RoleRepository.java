package com.agileflow.agileflow_backend.auth.repository;

import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.common.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}