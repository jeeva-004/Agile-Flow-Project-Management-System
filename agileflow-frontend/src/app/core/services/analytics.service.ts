import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/projects`;

  getIssuesByStatus(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/analytics/issues-by-status`);
  }

  getIssuesByPriority(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/analytics/issues-by-priority`);
  }

  getSprintVelocity(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/analytics/sprint-velocity`);
  }

  getWorklogSummary(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/analytics/worklog-summary`);
  }

  getProjectSummaryReport(projectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}/report/summary`);
  }
}
