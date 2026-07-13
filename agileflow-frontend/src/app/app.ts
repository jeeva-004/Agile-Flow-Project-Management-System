import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
import { ProjectService } from './core/services/project.service';
import { UserService } from './core/services/user.service';
import { NotificationListComponent } from './features/notifications/notification-list/notification-list';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { IssueService } from './core/services/issue.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet, NotificationListComponent, ToastComponent, ConfirmModalComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('agileflow-frontend');
  private readonly notificationService = inject(NotificationService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly issueService = inject(IssueService);

  isLoading = this.loadingService.isLoading;

  get unreadCount(): number {
    return this.notificationService.unreadCountSignal();
  }

  searchQuery = '';
  searchResultsProjects: any[] = [];
  searchResultsIssues: any[] = [];

  onSearchInput(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.searchResultsProjects = [];
      this.searchResultsIssues = [];
      return;
    }

    this.projectService.findAll(0, 100).subscribe({
      next: (res) => {
        const list = res?.data?.content ?? res?.content ?? [];
        this.searchResultsProjects = list.filter((p: any) =>
          p.name.toLowerCase().includes(query) || (p.key && p.key.toLowerCase().includes(query))
        );
      }
    });

    if (this.currentProjectId) {
      this.issueService.findByProject(this.currentProjectId, 0, 100).subscribe({
        next: (res) => {
          const list = res?.data?.content ?? res?.content ?? [];
          this.searchResultsIssues = list.filter((i: any) =>
            i.title.toLowerCase().includes(query) || (i.description && i.description.toLowerCase().includes(query))
          );
        }
      });
    } else {
      this.searchResultsIssues = [];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResultsProjects = [];
    this.searchResultsIssues = [];
  }
  panelOpen = false;
  sidebarOpen = false;

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
      this.closeSidebar();
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
    this.notificationService.unreadCount().subscribe();

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
    if (this.panelOpen) {
      this.notificationService.unreadCount().subscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    this.sidebarOpen = false;
  }
}
