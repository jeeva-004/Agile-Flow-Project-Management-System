import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMessage = '';
  showDemoModal = false;
  copiedToastMessage = '';
  private toastTimeout: any;

  openDemoModal(): void {
    this.showDemoModal = true;
  }

  closeDemoModal(): void {
    this.showDemoModal = false;
  }

  fillCredentials(email: string, pass: string): void {
    this.loginForm.patchValue({
      email: email,
      password: pass
    });
    this.loginForm.get('email')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
    this.showToast('Credentials loaded into login form!');
    this.closeDemoModal();
  }

  copyToClipboard(text: string, label: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    this.showToast(`${label} copied to clipboard!`);
  }

  private showToast(msg: string): void {
    this.copiedToastMessage = msg;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.copiedToastMessage = '';
    }, 2500);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          this.errorMessage = err.error.errors.join(', ');
        } else {
          this.errorMessage = err.error?.message || 'An error occurred during login. Please try again.';
        }
      }
    });
  }
}

