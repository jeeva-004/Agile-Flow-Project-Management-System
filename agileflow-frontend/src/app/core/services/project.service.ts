import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly http =
    inject(HttpClient);

  private readonly api =

    `${environment.apiUrl}/projects`;

  create(

    request: any

  ): Observable<any> {

    return this.http.post(

      this.api,

      request

    );

  }

  findAll(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {

    return this.http.get(

      this.api,

      {
        params: {
          page: page.toString(),
          size: size.toString(),
          sortBy,
          sortDir
        }
      }

    );

  }

  search(
    keyword?: string,
    ownerId?: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'desc'
  ): Observable<any> {
    const params: any = {
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    };
    if (keyword) {
      params.keyword = keyword;
    }
    if (ownerId !== undefined && ownerId !== null) {
      params.ownerId = ownerId.toString();
    }

    return this.http.get(
      `${this.api}/search`,
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

    return this.http.put(

      `${this.api}/${id}`,

      request

    );

  }

  delete(

    id: number

  ): Observable<any> {

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

}