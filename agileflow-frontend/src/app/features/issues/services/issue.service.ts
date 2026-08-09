import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { CreateIssueRequest, IssueResponse, UpdateIssueRequest } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getIssuesByProject(projectId: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<IssueResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<IssueResponse>>>(`${this.baseUrl}/projects/${projectId}/issues`, { params });
  }

  searchIssues(projectId: number, keyword?: string, status?: string, priority?: string, assigneeId?: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<IssueResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (keyword) params = params.set('keyword', keyword);
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    if (assigneeId) params = params.set('assigneeId', assigneeId.toString());
    return this.http.get<ApiResponse<PageResponse<IssueResponse>>>(`${this.baseUrl}/projects/${projectId}/issues/search`, { params });
  }

  getIssuesBySprint(sprintId: number): Observable<ApiResponse<IssueResponse[]>> {
    return this.http.get<ApiResponse<IssueResponse[]>>(`${this.baseUrl}/sprints/${sprintId}/issues`);
  }

  getIssue(id: number): Observable<ApiResponse<IssueResponse>> {
    return this.http.get<ApiResponse<IssueResponse>>(`${this.baseUrl}/issues/${id}`);
  }

  createIssue(request: CreateIssueRequest): Observable<ApiResponse<IssueResponse>> {
    return this.http.post<ApiResponse<IssueResponse>>(`${this.baseUrl}/issues`, request);
  }

  updateIssue(id: number, request: UpdateIssueRequest): Observable<ApiResponse<IssueResponse>> {
    return this.http.put<ApiResponse<IssueResponse>>(`${this.baseUrl}/issues/${id}`, request);
  }

  deleteIssue(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/issues/${id}`);
  }
}
