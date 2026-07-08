import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  private api =
    '/api/v1/attachments';

  constructor(
    private http: HttpClient
  ) {}

  upload(
    issueId:number,
    file:File
  ):Observable<any>{

    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post(

      `${this.api}/issues/${issueId}`,

      formData

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

      `${this.api}/issues/${issueId}`,
      { params }

    );

  }

  download(
    id:number
  ){

    return this.http.get(

      `${this.api}/download/${id}`,

      {

        responseType:'blob'

      }

    );

  }

  delete(
    id:number
  ){

    return this.http.delete(

      `${this.api}/${id}`

    );

  }

}