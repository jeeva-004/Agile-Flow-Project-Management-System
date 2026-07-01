import {

  Component,

  OnInit,

  inject

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

    'app-pm-dashboard',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:

    './pm-dashboard.html'

})
export class PmDashboardComponent
implements OnInit {

  private readonly service =

    inject(

      DashboardService

    );

  dashboard:any;

  ngOnInit(): void {

    this.service.pm()

      .subscribe({

        next: response => {

          this.dashboard =

            response.data;

        }

      });

  }

}