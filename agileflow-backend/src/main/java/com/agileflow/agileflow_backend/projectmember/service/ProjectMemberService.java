package com.agileflow.agileflow_backend.projectmember.service;

import com.agileflow.agileflow_backend.projectmember.dto.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProjectMemberService {

    ProjectMemberResponse add(

            AddProjectMemberRequest request);

    Page<ProjectMemberResponse>

    findByProject(

            Long projectId,
            Pageable pageable);

    List<ProjectMemberResponse>

    findByProject(

            Long projectId);

    void remove(

            Long id);

}