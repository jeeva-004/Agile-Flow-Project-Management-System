package com.agileflow.agileflow_backend.project.repository;

import com.agileflow.agileflow_backend.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProjectRepository
        extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    long countByOwnerId(

            Long ownerId

    );
}