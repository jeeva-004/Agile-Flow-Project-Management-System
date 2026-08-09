import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ActivityResponse } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/activities`;

  getActivitiesByProject(projectId: number): Observable<ApiResponse<ActivityResponse[]>> {
    return this.http.get<ApiResponse<ActivityResponse[]>>(`${this.baseUrl}/projects/${projectId}`);
  }
}
