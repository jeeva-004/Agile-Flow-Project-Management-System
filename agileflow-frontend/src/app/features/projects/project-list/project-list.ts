import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import { ProjectService }
  from '../../../core/services/project.service';
import { ActivityFeed } from '../../activities/activity-feed/activity-feed';

@Component({

  selector: 'app-project-list',

  standalone: true,

  imports: [

    CommonModule,

    ActivityFeed,
    RouterModule

  ],

  templateUrl:
    './project-list.html'

})
export class ProjectListComponent
  implements OnInit {

  private readonly service =
    inject(ProjectService);

  private readonly router =
    inject(Router);

  projects: any[] = [];

  ngOnInit(): void {

    this.loadProjects();

  }

  loadProjects(): void {

    this.service.findAll()

      .subscribe({

        next: response => {

          this.projects =
            response.data;

        }

      });

  }

  editProject(
    id: number
  ): void {

    this.router.navigate([

      '/projects',

      id,

      'edit'

    ]);

  }

  deleteProject(
    id: number
  ): void {

    const confirmed = confirm(

      'Delete this project?'

    );

    if (!confirmed) {

      return;

    }

    this.service.delete(id)

      .subscribe({

        next: () => {

          this.loadProjects();

        },

        error: error => {

          console.error(error);

        }

      });

  }

}