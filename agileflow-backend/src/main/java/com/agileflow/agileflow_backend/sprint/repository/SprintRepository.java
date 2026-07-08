package com.agileflow.agileflow_backend.sprint.repository;

import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface SprintRepository
        extends JpaRepository<Sprint,Long> {

    Page<Sprint> findByProjectId(Long projectId, Pageable pageable);

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