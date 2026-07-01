import {

  Component,

  inject,

  OnInit

} from '@angular/core';

import {

  CommonModule

} from '@angular/common';

import {

  DashboardService

}

from '../../../core/services/dashboard.service';

@Component({

  selector:

    'app-developer-dashboard',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:

    './developer-dashboard.html'

})
export class DeveloperDashboardComponent
implements OnInit {

  private readonly service =

    inject(

      DashboardService

    );

  dashboard:any;

  ngOnInit(): void {

    this.service.developer()

      .subscribe({

        next: response => {

          this.dashboard =

            response.data;

        }

      });

  }

}