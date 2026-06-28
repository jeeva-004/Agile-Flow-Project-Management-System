import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-create.html'
})
export class UserCreateComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly userService =
    inject(UserService);

  private readonly router =
    inject(Router);

  form = this.fb.group({

    firstName: [
      '',
      Validators.required
    ],

    lastName: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

roleId: [
  3,
  Validators.required
]

  });

submit(): void {
// console.log("valid:", this.form.valid);
// console.log("value:", this.form.value);
  if (this.form.invalid) {
    console.log(this.form);
    return;
  }

  const value = this.form.getRawValue();

  const payload = {

    firstName: value.firstName,

    lastName: value.lastName,

    email: value.email,

    password: value.password,

    roleIds: [value.roleId]

  };

  this.userService
    .create(payload as any)
    .subscribe({

      next: response => {

        console.log(response);

        this.router.navigate(['/users']);

      },

      error: err => {

        console.log(err);

      }

    });

}

}