package com.agileflow.agileflow_backend.projectmember.service.impl;

import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.dto.AddProjectMemberRequest;
import com.agileflow.agileflow_backend.projectmember.dto.ProjectMemberResponse;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.projectmember.service.ProjectMemberService;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@Service
public class ProjectMemberServiceImpl
        implements ProjectMemberService {

    private final ProjectMemberRepository repository;

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    public ProjectMemberServiceImpl(

            ProjectMemberRepository repository,

            ProjectRepository projectRepository,

            UserRepository userRepository) {

        this.repository = repository;

        this.projectRepository = projectRepository;

        this.userRepository = userRepository;

    }

    @Override
    public ProjectMemberResponse add(

            AddProjectMemberRequest request) {

        if (repository.existsByProjectIdAndUserId(

                request.getProjectId(),

                request.getUserId())) {

            throw new IllegalArgumentException(

                    "User already assigned");

        }

        Project project =

                projectRepository.findById(

                                request.getProjectId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Project not found"));

        User user =

                userRepository.findById(

                                request.getUserId())

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "User not found"));

        ProjectMember member =

                new ProjectMember();

        member.setProject(project);

        member.setUser(user);

        member = repository.save(member);

        return map(member);

    }

    @Override
    public List<ProjectMemberResponse>

    findByProject(

            Long projectId) {

        return repository

                .findByProjectId(

                        projectId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public void remove(

            Long id) {

        ProjectMember member =

                repository.findById(id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Member not found"));

        repository.delete(member);

    }

    private ProjectMemberResponse map(

            ProjectMember member) {

        ProjectMemberResponse response =

                new ProjectMemberResponse();

        response.setId(

                member.getId());

        response.setProjectId(

                member.getProject()

                        .getId());

        response.setUserId(

                member.getUser()

                        .getId());

        response.setUserName(

                member.getUser()

                        .getFirstName()

                        + " "

                        +

                        member.getUser()

                                .getLastName());

        response.setEmail(

                member.getUser()

                        .getEmail());

        return response;

    }

}