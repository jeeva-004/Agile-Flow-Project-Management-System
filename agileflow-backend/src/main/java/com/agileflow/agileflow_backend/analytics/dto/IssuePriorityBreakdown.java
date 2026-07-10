package com.agileflow.agileflow_backend.analytics.dto;

import com.agileflow.agileflow_backend.common.enums.IssuePriority;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssuePriorityBreakdown {
    private IssuePriority priority;
    private Long count;
}
