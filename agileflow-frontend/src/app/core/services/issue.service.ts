import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

@Injectable({

  providedIn: 'root'

})
export class IssueService {

  private readonly http =

    inject(HttpClient);

  private readonly api =
    `${environment.apiUrl}/issues`;
  
  
  
    create(
    request: any
  ): Observable<any> {
    return this.http.post(this.api,request);
  }

  findByProject(
    projectId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Observable<any> {

    return this.http.get(
      `${environment.apiUrl}/projects/${projectId}/issues`,
      {
        params: {
          page,
          size,
          sortBy,
          sortDir
        }
      }
    );
  }

  search(
    projectId: number,
    keyword?: string,
    status?: string,
    priority?: string,
    assigneeId?: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {
    const params: any = {
      page,
      size,
      sortBy,
      sortDir
    };
    if (keyword) {
      params.keyword = keyword;
    }
    if (status) {
      params.status = status;
    }
    if (priority) {
      params.priority = priority;
    }
    if (assigneeId !== undefined && assigneeId !== null) {
      params.assigneeId = assigneeId;
    }

    return this.http.get(
      `${environment.apiUrl}/projects/${projectId}/issues/search`,
      { params }
    );
  }

  findById(
    id: number
  ): Observable<any> {

    return this.http.get(
      `${this.api}/${id}`
    );

  }

  update(

    id: number,

    request: any

  ): Observable<any> {

    return this.http.put(`${this.api}/${id}`,request);

  }

  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}