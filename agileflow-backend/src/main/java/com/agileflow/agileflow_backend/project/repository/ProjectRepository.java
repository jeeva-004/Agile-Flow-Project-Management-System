package com.agileflow.agileflow_backend.project.repository;

import com.agileflow.agileflow_backend.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {
    long countByOwnerId(

            Long ownerId

    );
}