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

import { CommonModule }
from '@angular/common';

import { UserService }
from '../../../core/services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl:
    './user-edit.html',
  styleUrl: './user-edit.scss'
})
export class UserEditComponent
implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly fb =
    inject(FormBuilder);

  private readonly userService =
    inject(UserService);

  userId!: number;

  form = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    status: [
      'ACTIVE'
    ],

    roleIds: [
      [3]
    ]

  });

  ngOnInit(): void {

    this.userId = Number(

      this.route.snapshot.paramMap
        .get('id')

    );

    this.userService
      .findById(this.userId)

      .subscribe({

        next: response => {

          const user =
            response.data;

          this.form.patchValue({

            firstName:
              user.firstName,

            lastName:
              user.lastName,

            email:
              user.email,

            status:
              user.status

          });

        }

      });

  }

  submit(): void {

    if (this.form.invalid) {
      return;
    }

    this.userService
      .update(

        this.userId,

        this.form
          .getRawValue() as any

      )

      .subscribe({

        next: () => {

          this.router.navigate([
            '/users'
          ]);

        }

      });

  }

}