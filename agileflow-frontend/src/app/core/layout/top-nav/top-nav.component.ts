import { Component, OnInit, inject, OnDestroy, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationResponse } from '../../models/notification.model';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);
  private elementRef = inject(ElementRef);

  unreadCount = 0;
  notifications: NotificationResponse[] = [];
  showDropdown = false;
  
  private intervalId: any;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showDropdown) {
      const target = event.target as HTMLElement;
      const clickedInside = this.elementRef.nativeElement.querySelector('.notification-wrapper')?.contains(target);
      if (!clickedInside) {
        this.showDropdown = false;
      }
    }
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadNotifications();
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
      if (res.success && res.data !== undefined && res.data !== null) {
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
    this.confirmationService.confirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out of AgileFlow?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.authService.logout();
        this.confirmationService.success('Logged Out', 'You have been successfully logged out.');
      }
    });
  }
}
