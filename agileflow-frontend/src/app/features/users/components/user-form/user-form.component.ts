import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  isEditMode = false;
  userId?: number;
  isLoading = false;
  error = '';

  availableRoles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'PROJECT_MANAGER' },
    { id: 3, name: 'DEVELOPER' }
  ];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = +idParam;
    }

    this.initForm();

    if (this.isEditMode) {
      this.loadUser();
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['ACTIVE'],
      password: [''],
      roleIds: [[], Validators.required]
    });

    if (!this.isEditMode) {
      this.userForm.get('password')?.setValidators(Validators.required);
    }
  }

  private loadUser(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.userService.getUser(this.userId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            status: res.data.status,
            // Simple mapping since backend returns strings, we'd need IDs.
            // In a real app we'd map role names to role IDs properly.
            roleIds: res.data.roles.map(r => this.availableRoles.find(ar => ar.name === r)?.id).find(id => id) || null
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load user';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formValue = this.userForm.value;
    
    // Ensure roleIds are numbers
    formValue.roleIds = [Number(formValue.roleIds)]; // Simplification for select single/multiple

    const request = this.isEditMode ? 
      this.userService.updateUser(this.userId!, formValue) : 
      this.userService.createUser(formValue);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/users']);
        } else {
          this.error = res.message || 'Operation failed';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Operation failed';
        this.isLoading = false;
      }
    });
  }
}
