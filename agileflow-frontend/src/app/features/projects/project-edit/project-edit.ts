import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
}
from '@angular/forms';

import {
  ActivatedRoute,
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
import { UserService } from '../../../core/services/user.service';

@Component({

  selector:
    'app-project-edit',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:
    './project-edit.html'

})
export class ProjectEditComponent
implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly service =
    inject(ProjectService);

  private readonly userService = inject(UserService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  projectId!: number;
  users: any[] = [];

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

  ngOnInit(): void {
    this.projectId = Number(
      this.route.snapshot.paramMap.get(
        'id'
      )
    );
    this.userService.findAll(0, 100).subscribe({
      next: (res) => {
        this.users = res.data?.content ?? [];
      }
    });
    this.loadProject();
  }

  loadProject(): void {

    this.service

      .findById(

        this.projectId

      )

      .subscribe({

        next: response => {

          this.form.patchValue(

            response.data

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

        this.projectId,

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