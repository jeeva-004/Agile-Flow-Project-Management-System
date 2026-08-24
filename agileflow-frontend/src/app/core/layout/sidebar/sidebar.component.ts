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
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', path: '/dashboard' },
    { label: 'Projects', icon: 'bi-folder2-open', path: '/projects' },
    { label: 'Issues', icon: 'bi-ticket-detailed-fill', path: '/issues' },
    { label: 'Users', icon: 'bi-people-fill', path: '/users' }
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
