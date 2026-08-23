package com.agileflow.agileflow_backend.project.repository;

import com.agileflow.agileflow_backend.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Collection;
import java.util.List;

public interface ProjectRepository
        extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    long countByOwnerId(

            Long ownerId

    );

    List<Project> findByOwnerId(Long ownerId);

    Page<Project> findByIdIn(Collection<Long> ids, Pageable pageable);
}
