package com.agileflow.agileflow_backend.projectmember.repository;

import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember>

    findByProjectId(

            Long projectId);

    boolean existsByProjectIdAndUserId(

            Long projectId,

            Long userId);

    long countByProjectOwnerId(Long ownerId);
}