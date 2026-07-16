import { Component, OnInit, inject } from '@angular/core';

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
import { ToastService } from '../../../core/services/toast.service';

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
export class Login implements OnInit {
  form: FormGroup;
  showPassword = false;
  showDemo = false;

  private readonly toastService = inject(ToastService);

  toggleDemo(): void {
    this.showDemo = !this.showDemo;
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.success('Copied!', `${label} copied to clipboard.`);
    });
  }

  copyAll(email: string, pass: string, label: string): void {
    const text = `Email: ${email}\nPassword: ${pass}`;
    navigator.clipboard.writeText(text).then(() => {
      this.toastService.success('Copied All!', `${label} credentials copied.`);
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const role = localStorage.getItem('role');
      if (role === 'ADMIN') {
        this.router.navigate(['/dashboard/admin']);
      } else if (role === 'PROJECT_MANAGER') {
        this.router.navigate(['/dashboard/pm']);
      } else {
        this.router.navigate(['/dashboard/developer']);
      }
    }
  }

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

  loading = false;

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(
      this.form.getRawValue()
    )
      .subscribe({
        next: response => {
          this.loading = false;
          const role = response.data.role;
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else if (role === 'PROJECT_MANAGER') {
            this.router.navigate(['/dashboard/pm']);
          } else {
            this.router.navigate(['/dashboard/developer']);
          }
        },
        error: error => {
          this.loading = false;
          console.error(error);
          this.toastService.error('Login Failed', 'Invalid email or password.');
        }
      });
  }

}