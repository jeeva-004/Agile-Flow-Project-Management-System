import { Injectable, inject } from '@angular/core';

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

  private readonly api =

    'http://localhost:8080/api/v1';

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

      issueId:number

  ):Observable<any>{

    return this.http.get(

      `${this.api}/issues/${issueId}/worklogs`

    );

  }

  findByUser(

      userId:number

  ):Observable<any>{

    return this.http.get(

      `${this.api}/users/${userId}/worklogs`

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