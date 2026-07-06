import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'

})
export class ActivityService {

  private api =
    '/api/v1/activities';

  constructor(

    private http: HttpClient

  ) {}

  findByProject(

    projectId:number

  ):Observable<any>{

    return this.http.get(

      `${this.api}/projects/${projectId}`

    );

  }

}