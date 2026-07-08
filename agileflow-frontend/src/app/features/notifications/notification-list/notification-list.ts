import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-list.html'
})
export class NotificationListComponent implements OnInit {

  private readonly notificationService = inject(NotificationService);

  notifications: NotificationItem[] = [];
  unreadCount = 0;
  loading = false;

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'createdAt';
  sortDir = 'desc';

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.findMyNotifications(this.page, this.size, this.sortBy, this.sortDir).subscribe({
      next: (response) => {
        this.notifications = response?.data?.content ?? response?.content ?? [];
        this.totalPages = response?.data?.totalPages ?? response?.totalPages ?? 0;
        this.totalElements = response?.data?.totalElements ?? response?.totalElements ?? 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.loadNotifications();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.loadNotifications();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadNotifications();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadNotifications();
    }
  }

  loadUnreadCount(): void {
    this.notificationService.unreadCount().subscribe({
      next: (response) => {
        this.unreadCount = response?.data ?? response ?? 0;
      }
    });
  }

  markAsRead(notification: NotificationItem): void {
    if (notification.read) {
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      }
    });
  }

  deleteNotification(notification: NotificationItem): void {
    this.notificationService.delete(notification.id).subscribe({
      next: () => {
        const wasUnread = !notification.read;
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        if (wasUnread) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      }
    });
  }
}