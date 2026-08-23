import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { UserResponse } from '../models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);

  users: UserResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  error = '';
  
  isAdmin = false;

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.isAdmin = user.role === 'ADMIN';
      }
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.users = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadUsers();
    }
  }

  deleteUser(id: number): void {
    const user = this.users.find(u => u.id === id);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';
    this.confirmationService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'User deleted successfully.');
              this.loadUsers();
            }
          },
          error: (err) => {
            this.confirmationService.error('Action Failed', err.error?.message || 'Failed to delete user.');
          }
        });
      }
    });
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
