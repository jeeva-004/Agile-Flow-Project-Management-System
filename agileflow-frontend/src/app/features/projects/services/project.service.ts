import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { CreateProjectRequest, ProjectResponse, UpdateProjectRequest } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/projects`;

  getProjects(page = 0, size = 10): Observable<ApiResponse<PageResponse<ProjectResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<ProjectResponse>>>(this.baseUrl, { params });
  }

  searchProjects(keyword?: string, ownerId?: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<ProjectResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (keyword) params = params.set('keyword', keyword);
    if (ownerId) params = params.set('ownerId', ownerId.toString());
    return this.http.get<ApiResponse<PageResponse<ProjectResponse>>>(`${this.baseUrl}/search`, { params });
  }

  getProject(id: number): Observable<ApiResponse<ProjectResponse>> {
    return this.http.get<ApiResponse<ProjectResponse>>(`${this.baseUrl}/${id}`);
  }

  createProject(request: CreateProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.post<ApiResponse<ProjectResponse>>(this.baseUrl, request);
  }

  updateProject(id: number, request: UpdateProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.put<ApiResponse<ProjectResponse>>(`${this.baseUrl}/${id}`, request);
  }

  deleteProject(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
