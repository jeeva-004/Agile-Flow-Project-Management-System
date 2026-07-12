import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { NotificationService } from './core/services/notification.service';
import { ProjectService } from './core/services/project.service';
import { UserService } from './core/services/user.service';
import { NotificationListComponent } from './features/notifications/notification-list/notification-list';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotificationListComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('agileflow-frontend');
  private readonly notificationService = inject(NotificationService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  unreadCount = 0;
  panelOpen = false;

  role: string | null = null;
  currentProjectId: number | null = null;
  currentProjectName: string | null = null;

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    if (this.role) {
      this.loadUserData();
    }

    // Track active project from URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const prevRole = this.role;
      this.role = localStorage.getItem('role');
      this.extractProjectContext();
      if (!prevRole && this.role) {
        this.loadUserData();
      }
    });

    this.extractProjectContext();
  }

  private loadUserData(): void {
    this.notificationService.unreadCount().subscribe({
      next: (res) => (this.unreadCount = res?.data ?? res ?? 0)
    });

    const email = this.getEmailFromToken();
    if (email) {
      this.userService.findAll(0, 100).subscribe({
        next: (res) => {
          const list = res.data?.content ?? [];
          const currentUser = list.find((u: any) => u.email === email);
          if (currentUser) {
            localStorage.setItem('current_user_id', currentUser.id.toString());
            localStorage.setItem('current_user_name', `${currentUser.firstName} ${currentUser.lastName}`);
          }
        }
      });
    }
  }

  private extractProjectContext(): void {
    const url = this.router.url;
    const match = url.match(/\/projects\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      if (this.currentProjectId !== id) {
        this.currentProjectId = id;
        localStorage.setItem('current_project_id', id.toString());
        this.projectService.findById(id).subscribe({
          next: (res) => {
            this.currentProjectName = res.data?.name ?? 'Project';
            localStorage.setItem('current_project_name', this.currentProjectName!);
          }
        });
      }
    } else {
      const storedId = localStorage.getItem('current_project_id');
      const storedName = localStorage.getItem('current_project_name');
      if (storedId) {
        this.currentProjectId = Number(storedId);
        this.currentProjectName = storedName || 'Project';
      }
    }
  }

  logout(): void {
    localStorage.clear();
    this.role = null;
    this.currentProjectId = null;
    this.currentProjectName = null;
    this.router.navigate(['/login']);
  }

  private getEmailFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (e) {
      return null;
    }
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
}
