import { Component } from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService }
  from '../../../core/services/auth.service';

@Component({

  selector: 'app-login',

  standalone: true,

  imports: [

    ReactiveFormsModule

  ],

  templateUrl: './login.html'

})
export class Login {

  form: FormGroup;

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