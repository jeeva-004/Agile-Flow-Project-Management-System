import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  private router = inject(Router);

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Projects', icon: 'folder', path: '/projects' },
    { label: 'Issues', icon: 'bug_report', path: '/issues' },
    { label: 'Users', icon: 'group', path: '/users' }
  ];

  isNavActive(path: string): boolean {
    const currentUrl = this.router.url;
    if (path === '/issues') {
      return currentUrl.includes('/issues');
    }
    if (path === '/projects') {
      return currentUrl.startsWith('/projects') && !currentUrl.includes('/issues');
    }
    return currentUrl.startsWith(path);
  }
}
