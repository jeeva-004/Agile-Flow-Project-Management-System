package com.agileflow.agileflow_backend.attachment.controller;

import com.agileflow.agileflow_backend.attachment.dto.AttachmentResponse;
import com.agileflow.agileflow_backend.attachment.entity.Attachment;
import com.agileflow.agileflow_backend.attachment.repository.AttachmentRepository;
import com.agileflow.agileflow_backend.common.exception.ResourceNotFoundException;
import com.agileflow.agileflow_backend.common.payload.ApiResponse;
import com.agileflow.agileflow_backend.attachment.service.AttachmentService;
import com.agileflow.agileflow_backend.attachment.service.impl.AttachmentServiceImpl;
import org.springframework.http.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(
        "/api/v1/attachments")
public class AttachmentController {

    private final AttachmentService service;
    private final AttachmentRepository attachmentRepository;
    public AttachmentController(

            AttachmentService service,
            AttachmentRepository attachmentRepository) {

        this.service =
                service;
        this.attachmentRepository = attachmentRepository;
    }

    @PostMapping(
            "/issues/{issueId}")
    public ResponseEntity<ApiResponse<AttachmentResponse>>
    upload(

            @PathVariable
            Long issueId,

            @RequestParam(
                    "file")
            MultipartFile file){

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Attachment uploaded",

                        service.upload(

                                issueId,

                                file)

                )

        );

    }

    @GetMapping(
            "/issues/{issueId}")
    public ResponseEntity<ApiResponse<?>>
    list(

            @PathVariable
            Long issueId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir){

        if (page != null && size != null) {
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Attachments",
                            service.findByIssue(issueId, pageable)
                    )
            );
        }

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Attachments",

                        service.findByIssue(

                                issueId)

                )

        );

    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(
            @PathVariable Long id){

        Attachment attachment =
                attachmentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attachment not found"));

        byte[] file =
                service.download(id);

        return ResponseEntity.ok()

                .contentType(
                        MediaType.parseMediaType(
                                attachment.getContentType()))

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + attachment.getOriginalFileName()
                                + "\"")

                .body(file);

    }
    @DeleteMapping(
            "/{id}")
    public ResponseEntity<ApiResponse<String>>
    delete(

            @PathVariable
            Long id){

        service.delete(

                id);

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Attachment deleted",

                        null

                )

        );

    }

}