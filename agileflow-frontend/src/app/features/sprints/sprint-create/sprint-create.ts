import {
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  SprintService
} from '../../../core/services/sprint.service';

@Component({
  selector: 'app-sprint-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sprint-create.html'
})
export class SprintCreateComponent {

  private readonly fb =

    inject(FormBuilder);

  private readonly service =

    inject(SprintService);

  private readonly route =

    inject(ActivatedRoute);

  private readonly router =

    inject(Router);

  projectId = Number(

    this.route.snapshot

      .paramMap

      .get(

        'id'

      )

  );

  form = this.fb.group({

    name: [

      '',

      Validators.required

    ],

    startDate: [

      '',

      Validators.required

    ],

    endDate: [

      '',

      Validators.required

    ]

  });

  submit(): void {

    if (

      this.form.invalid

    ) {

      return;

    }

    const request = {

      ...this.form

        .getRawValue(),

      projectId:

        this.projectId

    };

    this.service

      .create(

        request

      )

      .subscribe({

        next: () => {

          this.router.navigate([

            '/projects',

            this.projectId,

            'sprints'

          ]);

        }

      });

  }

}