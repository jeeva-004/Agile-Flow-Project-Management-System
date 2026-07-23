import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { DialogService } from '../../../core/services/dialog.service';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './notification-list.html',
  styleUrls: ['./notification-list.scss']
})
export class NotificationListComponent implements OnInit {

  @Input() isDropdown = false;

  private readonly notificationService = inject(NotificationService);
  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  notifications: NotificationItem[] = [];
  get unreadCount(): number {
    return this.notificationService.unreadCountSignal();
  }
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
    this.notificationService.unreadCount().subscribe();
  }

  markAsRead(notification: NotificationItem): void {
    if (notification.read) {
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.notificationService.unreadCountSignal.update(val => Math.max(0, val - 1));
        this.toastService.success('Notification Read', 'The notification has been marked as read.');
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.notificationService.unreadCountSignal.set(0);
        this.toastService.success('All Read', 'All notifications have been marked as read.');
      }
    });
  }

  deleteNotification(notification: NotificationItem): void {
    this.dialogService.confirm({
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      intent: 'danger'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.notificationService.delete(notification.id).subscribe({
        next: () => {
          const wasUnread = !notification.read;
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          if (wasUnread) {
            this.notificationService.unreadCountSignal.update(val => Math.max(0, val - 1));
          }
          this.toastService.success('Notification Deleted', 'The notification has been deleted.');
        }
      });
    });
  }
}