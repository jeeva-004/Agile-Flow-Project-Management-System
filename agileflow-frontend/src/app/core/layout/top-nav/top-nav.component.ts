import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationResponse } from '../../models/notification.model';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  unreadCount = 0;
  notifications: NotificationResponse[] = [];
  showDropdown = false;
  
  private intervalId: any;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadNotifications();
      // Poll every 1 minute
      this.intervalId = setInterval(() => this.loadNotifications(), 60000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadNotifications(): void {
    this.notificationService.getUnreadCount().subscribe(res => {
      if (res.success && res.data) {
        this.unreadCount = res.data;
      }
    });

    this.notificationService.getNotifications(0, 5).subscribe(res => {
      if (res.success && res.data) {
        this.notifications = res.data.content;
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notification: NotificationResponse): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
    }
    
    if (notification.redirectUrl) {
      this.showDropdown = false;
      this.router.navigateByUrl(notification.redirectUrl);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.unreadCount = 0;
      this.notifications.forEach(n => n.read = true);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
