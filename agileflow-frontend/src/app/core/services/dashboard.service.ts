import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({

  providedIn: 'root'

})
export class DashboardService {

  private readonly http =

    inject(HttpClient);

  private readonly api =

    'http://localhost:8080/api/v1/dashboard';

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