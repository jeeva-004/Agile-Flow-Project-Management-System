import {

  Component,

  inject

}

  from '@angular/core';

import {

  FormBuilder,

  ReactiveFormsModule,

  Validators

}

  from '@angular/forms';

import {

  Router

}

  from '@angular/router';

import {

  CommonModule

}

  from '@angular/common';

import {

  ProjectService

}

  from '../../../core/services/project.service';

@Component({

  selector: 'app-project-create',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:

    './project-create.html'

})

export class ProjectCreateComponent {

  private readonly fb =

    inject(FormBuilder);

  private readonly service =

    inject(ProjectService);

  private readonly router =

    inject(Router);

  form = this.fb.group({

    name: [

      '',

      Validators.required

    ],

    description: [''],

    startDate: [

      '',

      Validators.required

    ],

    endDate: [

      '',

      Validators.required

    ],

    ownerId: [

      1,

      Validators.required

    ]

  });

  submit(): void {

    if (

      this.form.invalid

    ) {

      this.form.markAllAsTouched();

      return;

    }

    this.service.create(

      this.form.getRawValue()

    )

      .subscribe({

        next: () => {

          this.router.navigate([

            '/projects'

          ]);

        }

      });

  }

}