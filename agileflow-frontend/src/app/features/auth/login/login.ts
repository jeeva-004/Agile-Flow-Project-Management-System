import { Component } from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { AuthService }
  from '../../../core/services/auth.service';

@Component({

  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  form: FormGroup;
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private router: Router

  ) {

    this.form = this.fb.group({

      email: [

        '',

        [

          Validators.required,

          Validators.email

        ]

      ],

      password: [

        '',

        Validators.required

      ]

    });

  }

  submit(): void {

    if (

      this.form.invalid

    ) {

      return;

    }

    this.authService.login(

      this.form.getRawValue()

    )

      .subscribe({

        next: response => {

          const role =

            response.data.role;

          if (

            role === 'ADMIN'

          ) {

            this.router.navigate([

              '/dashboard/admin'

            ]);

          }

          else if (

            role === 'PROJECT_MANAGER'

          ) {

            this.router.navigate([

              '/dashboard/pm'

            ]);

          }

          else {

            this.router.navigate([

              '/dashboard/developer'

            ]);

          }

        },

        error: error => {

          console.error(

            error

          );

        }

      });

  }

}