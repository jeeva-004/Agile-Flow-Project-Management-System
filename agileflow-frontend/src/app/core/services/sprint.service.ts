import {
  inject,
  Injectable
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
export class SprintService {

  private readonly http =
    inject(HttpClient);

  private readonly api =

    `${environment.apiUrl}/sprints`;

  create(
    request: any
  ): Observable<any> {

    return this.http.post(

      this.api,

      request

    );

  }

  findByProject(
    projectId: number
  ): Observable<any> {

    return this.http.get(

      `${environment.apiUrl}/projects/${projectId}/sprints`

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