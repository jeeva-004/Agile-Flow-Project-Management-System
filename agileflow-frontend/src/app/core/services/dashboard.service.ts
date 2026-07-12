import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import { HttpClient } from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})
export class DashboardService {

  private readonly http =

    inject(HttpClient);

  private readonly api = `${environment.apiUrl}/dashboard`;

  admin() {

    return this.http.get<any>(

      `${this.api}/admin`

    );

  }

  pm() {

    return this.http.get<any>(

      `${this.api}/pm`

    );

  }

  developer() {

    return this.http.get<any>(

      `${this.api}/developer`

    );

  }

}