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

  findAll(): Observable<any> {

    return this.http.get(

      this.api

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