package com.agileflow.agileflow_backend.analytics.dto;

import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueStatusBreakdown {
    private IssueStatus status;
    private Long count;
}
