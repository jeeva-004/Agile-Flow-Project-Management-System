import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { IssueHistoryResponse } from '../models/issue-history.model';

@Injectable({
  providedIn: 'root'
})
export class IssueHistoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/history`;

  getIssueHistory(issueId: number): Observable<ApiResponse<IssueHistoryResponse[]>> {
    return this.http.get<ApiResponse<IssueHistoryResponse[]>>(`${this.baseUrl}/issues/${issueId}`);
  }
}
