import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  ProjectService
} from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './project-create.html',
  styleUrl: './project-create.scss'
})
export class ProjectCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  users: any[] = [];

  ngOnInit(): void {
    this.userService.findAll(0, 100).subscribe({
      next: (res) => {
        this.users = res.data?.content ?? [];
      }
    });
  }

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
          this.toastService.success('Project Created', 'The project was successfully created.');
          this.router.navigate([

            '/projects'

          ]);

        },
        error: () => {
          this.toastService.error('Error', 'Failed to create project.');
        }

      });

  }

}