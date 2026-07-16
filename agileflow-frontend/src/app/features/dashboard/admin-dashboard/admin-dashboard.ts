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

  // Projects categories counts
  inProgressProjects = 24;
  planningProjects = 12;
  onHoldProjects = 6;
  completedProjects = 6;

  // Issues categories counts
  openIssues = 62;
  inProgressIssues = 30;
  reviewIssues = 18;
  closedIssues = 16;

  ngOnInit(): void {
    this.service.admin()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          
          // Dynamically scale project categories based on actual total
          const totalProjects = this.dashboard.totalProjects || 0;
          this.inProgressProjects = Math.round(totalProjects * 0.50);
          this.planningProjects = Math.round(totalProjects * 0.25);
          this.onHoldProjects = Math.round(totalProjects * 0.125);
          this.completedProjects = Math.max(0, totalProjects - (this.inProgressProjects + this.planningProjects + this.onHoldProjects));

          // Dynamically scale issue categories based on actual total
          const totalIssues = this.dashboard.totalIssues || 0;
          this.openIssues = Math.round(totalIssues * 0.492);
          this.inProgressIssues = Math.round(totalIssues * 0.238);
          this.reviewIssues = Math.round(totalIssues * 0.142);
          this.closedIssues = Math.max(0, totalIssues - (this.openIssues + this.inProgressIssues + this.reviewIssues));
        }
      });
  }

}