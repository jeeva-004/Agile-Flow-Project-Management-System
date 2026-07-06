package com.agileflow.agileflow_backend.activity.repository;

import com.agileflow.agileflow_backend.activity.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository
        extends JpaRepository<Activity,Long> {

    List<Activity>
    findByProjectIdOrderByCreatedAtDesc(
            Long projectId);

}