import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  SprintService
} from '../../../core/services/sprint.service';

@Component({

  selector:

  'app-sprint-edit',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:

  './sprint-edit.html'

})
export class SprintEditComponent
implements OnInit {

  private readonly fb =

    inject(FormBuilder);

  private readonly service =

    inject(SprintService);

  private readonly route =

    inject(ActivatedRoute);

  private readonly router =

    inject(Router);

  sprintId!: number;

  projectId!: number;

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

  ngOnInit(): void {

    this.sprintId = Number(

      this.route.snapshot

        .paramMap

        .get('id')

    );

    this.load();

  }

  load(): void {

    this.service

      .findById(

        this.sprintId

      )

      .subscribe({

        next: response => {

          const sprint =

            response.data;

          this.projectId =

            sprint.projectId;

          this.form.patchValue(

            sprint

          );

        }

      });

  }

  submit(): void {

    if (

      this.form.invalid

    ) {

      return;

    }

    this.service

      .update(

        this.sprintId,

        this.form.getRawValue()

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