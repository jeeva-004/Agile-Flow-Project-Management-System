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
export class ProjectMemberService {

  private readonly http =

    inject(HttpClient);

  private readonly api =

    `${environment.apiUrl}/project-members`;

  add(

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

      `${environment.apiUrl}/projects/${projectId}/members`

    );

  }
  remove(

    id: number

  ): Observable<any> {

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

}