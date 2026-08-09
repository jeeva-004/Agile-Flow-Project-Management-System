import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { 
  IssueStatusBreakdown, 
  IssuePriorityBreakdown, 
  SprintVelocity, 
  WorklogSummary,
  ProjectSummaryReport
} from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private analyticsUrl = `${environment.apiUrl}/projects`;

  getProjectSummaryReport(projectId: number): Observable<ApiResponse<ProjectSummaryReport>> {
    return this.http.get<ApiResponse<ProjectSummaryReport>>(`${this.analyticsUrl}/${projectId}/report/summary`);
  }

  getIssuesByStatus(projectId: number): Observable<ApiResponse<IssueStatusBreakdown[]>> {
    return this.http.get<ApiResponse<IssueStatusBreakdown[]>>(`${this.analyticsUrl}/${projectId}/analytics/issues-by-status`);
  }

  getIssuesByPriority(projectId: number): Observable<ApiResponse<IssuePriorityBreakdown[]>> {
    return this.http.get<ApiResponse<IssuePriorityBreakdown[]>>(`${this.analyticsUrl}/${projectId}/analytics/issues-by-priority`);
  }

  getSprintVelocity(projectId: number): Observable<ApiResponse<SprintVelocity[]>> {
    return this.http.get<ApiResponse<SprintVelocity[]>>(`${this.analyticsUrl}/${projectId}/analytics/sprint-velocity`);
  }

  getWorklogSummary(projectId: number): Observable<ApiResponse<WorklogSummary[]>> {
    return this.http.get<ApiResponse<WorklogSummary[]>>(`${this.analyticsUrl}/${projectId}/analytics/worklog-summary`);
  }
}
