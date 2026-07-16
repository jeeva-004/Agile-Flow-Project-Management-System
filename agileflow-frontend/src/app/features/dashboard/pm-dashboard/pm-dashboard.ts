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
    './pm-dashboard.html',
  styleUrl: './pm-dashboard.scss'

})
export class PmDashboardComponent
implements OnInit {

  private readonly service =

    inject(

      DashboardService

    );

  dashboard:any;

  // Managed projects breakdown
  inProgressProjects = 3;
  planningProjects = 2;
  onHoldProjects = 1;
  completedProjects = 1;

  // Issues distribution
  openIssuesCount = 6;
  inProgressIssuesCount = 3;
  reviewIssuesCount = 2;
  closedIssuesCount = 1;

  ngOnInit(): void {
    this.service.pm()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          
          // Calculate project breakdown
          const totalProjects = this.dashboard.managedProjects || 0;
          this.inProgressProjects = Math.round(totalProjects * 0.50);
          this.planningProjects = Math.round(totalProjects * 0.25);
          this.onHoldProjects = Math.round(totalProjects * 0.125);
          this.completedProjects = Math.max(0, totalProjects - (this.inProgressProjects + this.planningProjects + this.onHoldProjects));

          // Calculate issues breakdown
          const totalIssues = this.dashboard.openIssues || 0;
          this.openIssuesCount = Math.round(totalIssues * 0.50);
          this.inProgressIssuesCount = Math.round(totalIssues * 0.25);
          this.reviewIssuesCount = Math.round(totalIssues * 0.125);
          this.closedIssuesCount = Math.max(0, totalIssues - (this.openIssuesCount + this.inProgressIssuesCount + this.reviewIssuesCount));
        }
      });
  }

}