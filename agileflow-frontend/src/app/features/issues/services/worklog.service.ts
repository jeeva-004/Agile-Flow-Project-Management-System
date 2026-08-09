import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { WorkLogResponse, CreateWorkLogRequest, UpdateWorkLogRequest } from '../models/worklog.model';

@Injectable({
  providedIn: 'root'
})
export class WorkLogService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getWorkLogsByIssue(issueId: number, page: number = 0, size: number = 20, sortBy: string = 'id', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<WorkLogResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
      
    return this.http.get<ApiResponse<PageResponse<WorkLogResponse>>>(`${this.baseUrl}/issues/${issueId}/worklogs`, { params });
  }

  createWorkLog(issueId: number, request: CreateWorkLogRequest): Observable<ApiResponse<WorkLogResponse>> {
    return this.http.post<ApiResponse<WorkLogResponse>>(`${this.baseUrl}/issues/${issueId}/worklogs`, request);
  }

  updateWorkLog(id: number, request: UpdateWorkLogRequest): Observable<ApiResponse<WorkLogResponse>> {
    return this.http.put<ApiResponse<WorkLogResponse>>(`${this.baseUrl}/worklogs/${id}`, request);
  }

  deleteWorkLog(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/worklogs/${id}`);
  }
}
