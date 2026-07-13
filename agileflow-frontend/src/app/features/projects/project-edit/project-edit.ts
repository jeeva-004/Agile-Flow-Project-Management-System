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
import { ToastService } from '../../../core/services/toast.service';

@Component({

  selector:
    'app-project-edit',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule

  ],

  templateUrl:
    './project-edit.html',
  styleUrl: './project-edit.scss'

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

  private readonly toastService =
    inject(ToastService);

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
          this.toastService.success('Project Updated', 'The project was successfully updated.');
          this.router.navigate([

            '/projects'

          ]);

        },
        error: () => {
          this.toastService.error('Error', 'Failed to update project.');
        }

      });

  }

}