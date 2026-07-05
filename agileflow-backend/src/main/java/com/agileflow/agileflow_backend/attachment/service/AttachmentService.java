package com.agileflow.agileflow_backend.attachment.service;

import com.agileflow.agileflow_backend.attachment.dto.AttachmentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {

    AttachmentResponse upload(
            Long issueId,
            MultipartFile file);

    List<AttachmentResponse> findByIssue(
            Long issueId);

    AttachmentResponse findById(
            Long id);

    byte[] download(
            Long id);

    void delete(
            Long id);

}