import {

  Component,

  OnInit,

  inject

} from '@angular/core';

import { CommonModule }

from '@angular/common';

import { DashboardService }

from '../../../core/services/dashboard.service';

@Component({

  selector:

    'app-admin-dashboard',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:

    './admin-dashboard.html',
    
  styleUrl:'./admin-dashboard.scss'

})
export class AdminDashboardComponent
implements OnInit {

  private readonly service =

    inject(

      DashboardService

    );

  dashboard:any;

  ngOnInit(): void {

    this.service.admin()

      .subscribe({

        next: response => {

          this.dashboard =

            response.data;

        }

      });

  }

}