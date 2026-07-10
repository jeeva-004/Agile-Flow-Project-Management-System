import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule,

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
  role: string | null = null;

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.loadProjects();
  }

  loadProjects(): void {

    this.service.findAll(this.page, this.size, this.sortBy, this.sortDir)

      .subscribe({

        next: response => {

          this.projects =
            response.data?.content ?? [];
          this.totalPages =
            response.data?.totalPages ?? 0;
          this.totalElements =
            response.data?.totalElements ?? 0;

        }

      });

  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.loadProjects();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.loadProjects();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadProjects();
    }
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