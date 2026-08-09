import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { CreateSprintRequest, SprintResponse, UpdateSprintRequest } from '../models/sprint.model';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getSprintsByProject(projectId: number, page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<SprintResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
      
    return this.http.get<ApiResponse<PageResponse<SprintResponse>>>(`${this.baseUrl}/projects/${projectId}/sprints`, { params });
  }

  getSprint(id: number): Observable<ApiResponse<SprintResponse>> {
    return this.http.get<ApiResponse<SprintResponse>>(`${this.baseUrl}/sprints/${id}`);
  }

  createSprint(request: CreateSprintRequest): Observable<ApiResponse<SprintResponse>> {
    return this.http.post<ApiResponse<SprintResponse>>(`${this.baseUrl}/sprints`, request);
  }

  updateSprint(id: number, request: UpdateSprintRequest): Observable<ApiResponse<SprintResponse>> {
    return this.http.put<ApiResponse<SprintResponse>>(`${this.baseUrl}/sprints/${id}`, request);
  }

  deleteSprint(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/sprints/${id}`);
  }
}
