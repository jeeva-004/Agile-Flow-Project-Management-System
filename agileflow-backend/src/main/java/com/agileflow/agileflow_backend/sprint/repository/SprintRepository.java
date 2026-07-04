package com.agileflow.agileflow_backend.sprint.repository;

import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository
        extends JpaRepository<Sprint,Long> {

    List<Sprint>
    findByProjectId(
            Long projectId);

    long countByProjectOwnerId(

            Long ownerId

    );

    boolean existsByProjectId(
            Long projectId
    );

}