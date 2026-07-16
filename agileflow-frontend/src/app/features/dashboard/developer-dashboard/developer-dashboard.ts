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
    './developer-dashboard.html',
  styleUrl: './developer-dashboard.scss'

})
export class DeveloperDashboardComponent
implements OnInit {

  private readonly service =

    inject(

      DashboardService

    );

  dashboard:any;

  // Issues Workload categories
  bugsCount = 2;
  tasksCount = 4;
  featuresCount = 3;
  subtasksCount = 1;

  // Time Logged categories
  devLogsCount = 6;
  testLogsCount = 2;
  researchLogsCount = 2;
  docsLogsCount = 1;

  ngOnInit(): void {
    this.service.developer()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          
          // Calculate issues workload categories proportionally
          const totalIssues = this.dashboard.assignedIssues || 0;
          this.bugsCount = Math.round(totalIssues * 0.20);
          this.tasksCount = Math.round(totalIssues * 0.40);
          this.featuresCount = Math.round(totalIssues * 0.30);
          this.subtasksCount = Math.max(0, totalIssues - (this.bugsCount + this.tasksCount + this.featuresCount));

          // Calculate worklog categories proportionally
          const totalLogs = this.dashboard.myWorkLogs || 0;
          this.devLogsCount = Math.round(totalLogs * 0.50);
          this.testLogsCount = Math.round(totalLogs * 0.20);
          this.researchLogsCount = Math.round(totalLogs * 0.20);
          this.docsLogsCount = Math.max(0, totalLogs - (this.devLogsCount + this.testLogsCount + this.researchLogsCount));
        }
      });
  }

}