import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AdminDashboardResponse, DeveloperDashboardResponse, ProjectManagerDashboardResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  getAdminDashboard(): Observable<ApiResponse<AdminDashboardResponse>> {
    return this.http.get<ApiResponse<AdminDashboardResponse>>(`${environment.apiUrl}/dashboard/admin`);
  }

  getPmDashboard(): Observable<ApiResponse<ProjectManagerDashboardResponse>> {
    return this.http.get<ApiResponse<ProjectManagerDashboardResponse>>(`${environment.apiUrl}/dashboard/pm`);
  }

  getDeveloperDashboard(): Observable<ApiResponse<DeveloperDashboardResponse>> {
    return this.http.get<ApiResponse<DeveloperDashboardResponse>>(`${environment.apiUrl}/dashboard/developer`);
  }
}
