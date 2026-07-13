import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationListComponent } from './notification-list';
import { NotificationService } from '../../../core/services/notification.service';
import { DialogService } from '../../../core/services/dialog.service';
import { of, throwError } from 'rxjs';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'findMyNotifications',
      'unreadCount',
      'markAsRead',
      'markAllAsRead',
      'delete'
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', ['confirm']);

    // Default mock behavior
    mockNotificationService.findMyNotifications.and.returnValue(of({
      data: {
        content: [
          { id: 1, title: 'Notif 1', message: 'Msg 1', type: 'INFO', read: false, createdAt: '2026-07-10T12:00:00' },
          { id: 2, title: 'Notif 2', message: 'Msg 2', type: 'WARNING', read: true, createdAt: '2026-07-10T12:05:00' }
        ],
        totalPages: 1,
        totalElements: 2
      }
    }));
    mockNotificationService.unreadCount.and.returnValue(of({ data: 1 }));
    mockNotificationService.markAsRead.and.returnValue(of({}));
    mockNotificationService.markAllAsRead.and.returnValue(of({}));
    mockNotificationService.delete.and.returnValue(of({}));
    mockDialogService.confirm.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [NotificationListComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: DialogService, useValue: mockDialogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
  });

  it('should load notifications and unread count on ngOnInit', () => {
    fixture.detectChanges(); // triggers ngOnInit -> loadNotifications() & loadUnreadCount()

    expect(mockNotificationService.findMyNotifications).toHaveBeenCalledWith(0, 10, 'createdAt', 'desc');
    expect(mockNotificationService.unreadCount).toHaveBeenCalled();
    expect(component.notifications.length).toBe(2);
    expect(component.unreadCount).toBe(1);
    expect(component.notifications[0].title).toBe('Notif 1');
    expect(component.totalPages).toBe(1);
  });

  it('should mark all notifications as read', () => {
    fixture.detectChanges();
    expect(component.notifications[0].read).toBeFalse();

    component.markAllAsRead();

    expect(mockNotificationService.markAllAsRead).toHaveBeenCalled();
    expect(component.notifications[0].read).toBeTrue();
    expect(component.unreadCount).toBe(0);
  });

  it('should mark a single notification as read and decrement unread count', () => {
    fixture.detectChanges();
    expect(component.notifications[0].read).toBeFalse();
    expect(component.unreadCount).toBe(1);

    component.markAsRead(component.notifications[0]);

    expect(mockNotificationService.markAsRead).toHaveBeenCalledWith(1);
    expect(component.notifications[0].read).toBeTrue();
    expect(component.unreadCount).toBe(0);
  });

  it('should delete notification and decrement unread count if notification was unread', () => {
    fixture.detectChanges();
    expect(component.notifications.length).toBe(2);
    expect(component.unreadCount).toBe(1);

    component.deleteNotification(component.notifications[0]); // delete id 1 (unread)

    expect(mockNotificationService.delete).toHaveBeenCalledWith(1);
    expect(component.notifications.length).toBe(1);
    expect(component.unreadCount).toBe(0);
  });

  it('should handle findMyNotifications error gracefully without crashing', () => {
    mockNotificationService.findMyNotifications.and.returnValue(throwError(() => new Error('Load failed')));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.notifications).toEqual([]);
  });
});
