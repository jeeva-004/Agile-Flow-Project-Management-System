import {

Injectable,

inject

}

from '@angular/core';

import {

HttpClient

}

from '@angular/common/http';

import {

Observable

}

from 'rxjs';

import {

environment

}

from '../../../environments/environment';

@Injectable({

providedIn:'root'

})
export class CommentService {

private readonly http=

inject(HttpClient);

private readonly api=

`${environment.apiUrl}/comments`;

create(

issueId:number,

request:any

):Observable<any>{

return this.http.post(
`${environment.apiUrl}/issues/${issueId}/comments`,
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

      `${environment.apiUrl}/issues/${issueId}/comments`,
      { params }

    );

  }

findById(

id:number

):Observable<any>{

return this.http.get(

`${this.api}/${id}`

);

}

update(

id:number,

request:any

):Observable<any>{

return this.http.put(

`${this.api}/${id}`,

request

);

}

delete(

id:number

):Observable<any>{

return this.http.delete(

`${this.api}/${id}`

);

}

}