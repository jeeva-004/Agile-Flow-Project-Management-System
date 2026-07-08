import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './core/services/notification.service';
import { NotificationListComponent } from './features/notifications/notification-list/notification-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotificationListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('agileflow-frontend');
    private readonly notificationService = inject(NotificationService);

  unreadCount = 0;
  panelOpen = false;

  ngOnInit(): void {
    this.notificationService.unreadCount().subscribe({
      next: (res) => (this.unreadCount = res?.data ?? res ?? 0)
    });
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
}
