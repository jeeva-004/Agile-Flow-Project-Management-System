import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ApiResponse } from '../../shared/models/api-response.model';
import { User } from '../../shared/models/user.model';
import { CreateUserRequest } from '../../shared/models/create-user-request.model';
import { UpdateUserRequest } from '../../shared/models/update-user-request.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly API =
    `${environment.apiUrl}/users`;

  findAll(): Observable<ApiResponse<User[]>> {

    return this.http.get<ApiResponse<User[]>>(
      this.API
    );
  }

  findById(
    id: number
  ): Observable<ApiResponse<User>> {

    return this.http.get<ApiResponse<User>>(
      `${this.API}/${id}`
    );
  }

  create(
    request: CreateUserRequest
  ): Observable<ApiResponse<User>> {

    return this.http.post<ApiResponse<User>>(
      this.API,
      request
    );
  }

  update(
    id: number,
    request: UpdateUserRequest
  ): Observable<ApiResponse<User>> {

    return this.http.put<ApiResponse<User>>(
      `${this.API}/${id}`,
      request
    );
  }

  delete(
    id: number
  ): Observable<ApiResponse<void>> {

    return this.http.delete<ApiResponse<void>>(
      `${this.API}/${id}`
    );
  }
}