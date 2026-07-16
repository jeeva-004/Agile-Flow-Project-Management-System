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
import { ToastService } from '../../../core/services/toast.service';

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

  private readonly toastService =
    inject(ToastService);

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
    status: ['ACTIVE'],
    roleId: [3, Validators.required]
  });

  ngOnInit(): void {
    this.userId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.userService
      .findById(this.userId)
      .subscribe({
        next: response => {
          const user = response.data;
          
          // Map user role name string to the corresponding form roleId
          const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'DEVELOPER';
          let roleId = 3;
          if (userRole === 'ADMIN') {
            roleId = 1;
          } else if (userRole === 'PROJECT_MANAGER') {
            roleId = 2;
          }

          this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            roleId: roleId
          });
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      status: value.status,
      roleIds: [value.roleId]
    };

    this.userService
      .update(this.userId, payload as any)
      .subscribe({
        next: () => {
          this.toastService.success('User Updated', 'The user was successfully updated.');
          this.router.navigate(['/users']);
        },
        error: () => {
          this.toastService.error('Error', 'Failed to update user.');
        }
      });
  }

}