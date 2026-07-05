package com.agileflow.agileflow_backend.attachment.service.impl;

import com.agileflow.agileflow_backend.attachment.dto.AttachmentResponse;
import com.agileflow.agileflow_backend.attachment.entity.Attachment;
import com.agileflow.agileflow_backend.attachment.repository.AttachmentRepository;
import com.agileflow.agileflow_backend.attachment.service.AttachmentService;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.common.enums.NotificationType;
import com.agileflow.agileflow_backend.notification.service.NotificationService;
import com.agileflow.agileflow_backend.security.CurrentUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentServiceImpl
        implements AttachmentService {

    private final AttachmentRepository repository;

    private final IssueRepository issueRepository;

    private final CurrentUserService currentUserService;

    private final NotificationService notificationService;

    private final AttachmentRepository attachmentRepository;

    @Value("${attachments.upload-dir}")
    private String uploadDir;

    public AttachmentServiceImpl(

            AttachmentRepository repository,

            IssueRepository issueRepository,

            CurrentUserService currentUserService,

            NotificationService notificationService,

            AttachmentRepository attachmentRepository) {

        this.repository =
                repository;

        this.issueRepository =
                issueRepository;

        this.currentUserService =
                currentUserService;

        this.notificationService =
                notificationService;

        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public AttachmentResponse upload(

            Long issueId,

            MultipartFile file) {

        try {

            Issue issue =

                    issueRepository

                            .findById(issueId)

                            .orElseThrow(() ->

                                    new ResourceNotFoundException(

                                            "Issue not found"));

            User user =

                    currentUserService

                            .getCurrentUser();

            String fileName =

                    UUID.randomUUID()

                            + "_"

                            + file.getOriginalFilename();

            Path directory =

                    Paths.get(

                            uploadDir,

                            "issues",

                            issueId.toString()

                    );

            Files.createDirectories(

                    directory

            );

            Path filePath =

                    directory.resolve(

                            fileName

                    );

            Files.copy(

                    file.getInputStream(),

                    filePath,

                    StandardCopyOption.REPLACE_EXISTING

            );

            Attachment attachment =

                    new Attachment();

            attachment.setIssue(

                    issue);

            attachment.setUploadedBy(

                    user);

            attachment.setFileName(

                    fileName);

            attachment.setOriginalFileName(

                    file.getOriginalFilename());

            attachment.setContentType(

                    file.getContentType());

            attachment.setFileSize(

                    file.getSize());

            attachment =

                    repository.save(

                            attachment);

            if(issue.getAssignee()!=null){

                notificationService.create(

                        issue.getAssignee(),

                        "Attachment Uploaded",

                        file.getOriginalFilename()

                                + " uploaded",

                        NotificationType.ATTACHMENT_UPLOADED,

                        "/issues/"
                                + issueId

                );

            }

            return map(

                    attachment);

        }

        catch (Exception ex){

            throw new RuntimeException(

                    ex.getMessage());

        }

    }

    @Override
    public List<AttachmentResponse>
    findByIssue(

            Long issueId) {

        return repository

                .findByIssueId(

                        issueId)

                .stream()

                .map(this::map)

                .toList();

    }

    @Override
    public AttachmentResponse findById(

            Long id) {

        return map(

                repository

                        .findById(

                                id)

                        .orElseThrow(() ->

                                new ResourceNotFoundException(

                                        "Attachment not found"

                                ))

        );

    }

    @Override
    public byte[] download(Long id) {

        Attachment attachment =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attachment not found"));

        Path filePath =
                Paths.get(
                        uploadDir,
                        "issues",
                        attachment.getIssue().getId().toString(),
                        attachment.getFileName()
                );

        try {

            return Files.readAllBytes(filePath);

        } catch (Exception ex) {

            throw new RuntimeException(ex);

        }

    }
    @Override
    public void delete(

            Long id) {

        try{

            Attachment attachment =

                    repository

                            .findById(

                                    id)

                            .orElseThrow(() ->

                                    new ResourceNotFoundException(

                                            "Attachment not found"

                                    ));

            Path filePath =

                    Paths.get(

                            uploadDir,

                            "issues",

                            attachment

                                    .getIssue()

                                    .getId()

                                    .toString(),

                            attachment

                                    .getFileName()

                    );

            Files.deleteIfExists(

                    filePath);

            repository.delete(

                    attachment);

        }

        catch (Exception ex){

            throw new RuntimeException(

                    ex.getMessage());

        }

    }

    private AttachmentResponse map(

            Attachment attachment) {

        AttachmentResponse response =

                new AttachmentResponse();

        response.setId(

                attachment.getId());

        response.setIssueId(

                attachment

                        .getIssue()

                        .getId());

        response.setFileName(

                attachment.getFileName());

        response.setOriginalFileName(

                attachment.getOriginalFileName());

        response.setContentType(

                attachment.getContentType());

        response.setFileSize(

                attachment.getFileSize());

        response.setUploadedById(

                attachment

                        .getUploadedBy()

                        .getId());

        response.setUploadedByName(

                attachment

                        .getUploadedBy()

                        .getFirstName()

                        + " " +

                        attachment

                                .getUploadedBy()

                                .getLastName());

        response.setUploadedAt(

                attachment.getUploadedAt());

        return response;

    }


    private Attachment findEntity(Long id){

        return attachmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attachment not found"));

    }
}