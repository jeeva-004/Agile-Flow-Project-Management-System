import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../users/models/user.model';
import { AttachmentResponse } from '../models/attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/attachments`;

  getAttachmentsByIssue(issueId: number, page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<AttachmentResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
      
    return this.http.get<ApiResponse<PageResponse<AttachmentResponse>>>(`${this.baseUrl}/issues/${issueId}`, { params });
  }

  uploadAttachment(issueId: number, file: File): Observable<ApiResponse<AttachmentResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<AttachmentResponse>>(`${this.baseUrl}/issues/${issueId}`, formData);
  }

  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, { responseType: 'blob' });
  }

  deleteAttachment(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
