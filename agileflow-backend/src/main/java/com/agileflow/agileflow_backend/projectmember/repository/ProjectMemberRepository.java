package com.agileflow.agileflow_backend.projectmember.repository;

import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    Page<ProjectMember> findByProjectId(Long projectId, Pageable pageable);

    List<ProjectMember>

    findByProjectId(

            Long projectId);

    boolean existsByProjectIdAndUserId(

            Long projectId,

            Long userId);

    long countByProjectOwnerId(Long ownerId);

    boolean existsByProjectId(
            Long projectId
    );
}