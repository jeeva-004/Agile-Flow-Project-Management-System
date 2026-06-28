import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { UserService }
from '../../../core/services/user.service';

import { User }
from '../../../shared/models/user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html'
})
export class UserList
implements OnInit {

  private readonly userService =
    inject(UserService);

  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.userService.findAll()
      .subscribe({
        next: response => {
          this.users = response.data;
        }
      });
  }

  deleteUser(id: number): void {

    if (!confirm(
      'Delete selected user?'
    )) {
      return;
    }

    this.userService.delete(id)
      .subscribe({
        next: () => {
          this.loadUsers();
        }
      });
  }
}