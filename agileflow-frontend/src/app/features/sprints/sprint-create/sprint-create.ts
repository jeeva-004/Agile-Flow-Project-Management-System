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
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sprint-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sprint-create.html',
  styleUrl: './sprint-create.scss'
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

  private readonly toastService =
    inject(ToastService);

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
          this.toastService.success('Sprint Created', 'The sprint was successfully created.');
          this.router.navigate([

            '/projects',

            this.projectId,

            'sprints'

          ]);

        },
        error: () => {
          this.toastService.error('Error', 'Failed to create sprint.');
        }

      });

  }

}