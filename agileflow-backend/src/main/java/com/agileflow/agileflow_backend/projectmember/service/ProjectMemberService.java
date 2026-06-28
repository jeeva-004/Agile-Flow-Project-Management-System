package com.agileflow.agileflow_backend.projectmember.service;

import com.agileflow.agileflow_backend.projectmember.dto.*;

import java.util.List;

public interface ProjectMemberService {

    ProjectMemberResponse add(

            AddProjectMemberRequest request);

    List<ProjectMemberResponse>

    findByProject(

            Long projectId);

    void remove(

            Long id);

}