import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({

  providedIn: 'root'

})
export class NotificationService {

  private readonly http =

    inject(HttpClient);

  private readonly api = environment.apiUrl;

  unreadCountSignal = signal(0);

  findMyNotifications(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Observable<any> {

    return this.http.get(

      `${this.api}/notifications`,

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

  unreadCount(

  ):Observable<any>{

    return this.http.get(

      `${this.api}/notifications/unread-count`

    ).pipe(
      tap((res: any) => {
        const count = res?.data ?? res ?? 0;
        this.unreadCountSignal.set(count);
      })
    );

  }

  markAsRead(

      id:number

  ):Observable<any>{

    return this.http.put(

      `${this.api}/notifications/${id}/read`,

      {}

    );

  }

  markAllAsRead(

  ):Observable<any>{

    return this.http.put(

      `${this.api}/notifications/read-all`,

      {}

    );

  }

  delete(

      id:number

  ):Observable<any>{

    return this.http.delete(

      `${this.api}/notifications/${id}`

    );

  }

}