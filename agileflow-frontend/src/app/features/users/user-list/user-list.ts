import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService }
from '../../../core/services/user.service';

import { User }
from '../../../shared/models/user.model';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.html'
})
export class UserList
implements OnInit {

  private readonly userService =
    inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  users: User[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.userService.findAll(this.page, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: response => {
          this.users = response.data?.content ?? [];
          this.totalPages = response.data?.totalPages ?? 0;
          this.totalElements = response.data?.totalElements ?? 0;
        }
      });
  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.loadUsers();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }

  deleteUser(id: number): void {
    this.dialogService.confirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      intent: 'danger'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.userService.delete(id).subscribe({
        next: () => {
          this.toastService.success('User Deleted', 'The user was successfully deleted.');
          this.loadUsers();
        },
        error: () => {
          this.toastService.error('Error', 'Failed to delete user.');
        }
      });
    });
  }
}