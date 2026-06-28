import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../shared/models/login-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API =
    `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient
  ) {}

  login(
    request: LoginRequest
  ): Observable<ApiResponse<LoginResponse>> {

    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.API}/login`,
      request
    ).pipe(
      tap(response => {
        localStorage.setItem(
          'access_token',
          response.data.token
        );

        localStorage.setItem(
          'role',
          response.data.role
        );
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}