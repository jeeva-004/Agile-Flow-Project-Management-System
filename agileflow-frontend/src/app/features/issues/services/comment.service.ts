import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { CommentResponse, CreateCommentRequest, UpdateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getCommentsByIssue(issueId: number, page: number = 0, size: number = 20, sortBy: string = 'id', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<CommentResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
      
    return this.http.get<ApiResponse<PageResponse<CommentResponse>>>(`${this.baseUrl}/issues/${issueId}/comments`, { params });
  }

  createComment(issueId: number, request: CreateCommentRequest): Observable<ApiResponse<CommentResponse>> {
    return this.http.post<ApiResponse<CommentResponse>>(`${this.baseUrl}/issues/${issueId}/comments`, request);
  }

  updateComment(id: number, request: UpdateCommentRequest): Observable<ApiResponse<CommentResponse>> {
    return this.http.put<ApiResponse<CommentResponse>>(`${this.baseUrl}/comments/${id}`, request);
  }

  deleteComment(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/comments/${id}`);
  }
}
