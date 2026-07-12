import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

@Injectable({

  providedIn: 'root'

})
export class WorkLogService {

  private readonly http =

    inject(HttpClient);

  private readonly api = environment.apiUrl;

  create(

      issueId:number,

      request:any

  ):Observable<any>{

    return this.http.post(

      `${this.api}/issues/${issueId}/worklogs`,

      request

    );

  }

  findByIssue(
    issueId: number,
    page?: number,
    size?: number,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {

    const params: any = {};
    if (page !== undefined && size !== undefined) {
      params.page = page.toString();
      params.size = size.toString();
      params.sortBy = sortBy;
      params.sortDir = sortDir;
    }

    return this.http.get(

      `${this.api}/issues/${issueId}/worklogs`,
      { params }

    );

  }

  findByUser(
    userId: number,
    page?: number,
    size?: number,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {

    const params: any = {};
    if (page !== undefined && size !== undefined) {
      params.page = page.toString();
      params.size = size.toString();
      params.sortBy = sortBy;
      params.sortDir = sortDir;
    }

    return this.http.get(

      `${this.api}/users/${userId}/worklogs`,
      { params }

    );

  }

  findById(

      id:number

  ):Observable<any>{

    return this.http.get(

      `${this.api}/worklogs/${id}`

    );

  }

  update(

      id:number,

      request:any

  ):Observable<any>{

    return this.http.put(

      `${this.api}/worklogs/${id}`,

      request

    );

  }

  delete(

      id:number

  ):Observable<any>{

    return this.http.delete(

      `${this.api}/worklogs/${id}`

    );

  }

}