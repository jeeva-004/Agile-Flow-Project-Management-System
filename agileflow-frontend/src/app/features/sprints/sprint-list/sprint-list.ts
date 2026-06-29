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

@Component({

  selector: 'app-sprint-list',

  standalone: true,

  imports: [

    CommonModule,

    RouterModule

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

        this.projectId

      )

      .subscribe({

        next: response => {

          this.sprints =

            response.data;

        }

      });

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