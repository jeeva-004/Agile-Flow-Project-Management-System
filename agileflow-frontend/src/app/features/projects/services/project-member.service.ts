import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { AddProjectMemberRequest, ProjectMemberResponse } from '../models/project-member.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getMembersByProject(projectId: number, page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<ProjectMemberResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
      
    return this.http.get<ApiResponse<PageResponse<ProjectMemberResponse>>>(`${this.baseUrl}/projects/${projectId}/members`, { params });
  }

  addMember(request: AddProjectMemberRequest): Observable<ApiResponse<ProjectMemberResponse>> {
    return this.http.post<ApiResponse<ProjectMemberResponse>>(`${this.baseUrl}/project-members`, request);
  }

  removeMember(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/project-members/${id}`);
  }
}
