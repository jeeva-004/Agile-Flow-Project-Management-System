import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  SprintService
} from '../../../core/services/sprint.service';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-sprint-list',

  standalone: true,

  imports: [

    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl:

    './sprint-list.html'

})
export class SprintListComponent
implements OnInit {

  private readonly service =

    inject(SprintService);

  private readonly route =

    inject(ActivatedRoute);

  private readonly router =

    inject(Router);

  projectId!: number;

  sprints: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {

    this.projectId = Number(

      this.route.snapshot

        .paramMap

        .get('id')

    );

    this.load();

  }

  load(): void {

    this.service

      .findByProject(

        this.projectId,
        this.page,
        this.size,
        this.sortBy,
        this.sortDir

      )

      .subscribe({

        next: response => {

          this.sprints =

            response.data?.content ?? response.content ?? [];
          this.totalPages = response.data?.totalPages ?? response.totalPages ?? 0;
          this.totalElements = response.data?.totalElements ?? response.totalElements ?? 0;

        }

      });

  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.load();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.load();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  editSprint(
    id: number
  ): void {

    this.router.navigate([

      '/sprints',

      id,

      'edit'

    ]);

  }

  deleteSprint(
    id: number
  ): void {

    if (

      !confirm(

        'Delete sprint?'

      )

    ) {

      return;

    }

    this.service

      .delete(id)

      .subscribe({

        next: () => {

          this.load();

        }

      });

  }

}