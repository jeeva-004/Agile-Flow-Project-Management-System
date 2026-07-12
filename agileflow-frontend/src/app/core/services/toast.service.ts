import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new Subject<ToastMessage>();
  private counter = 0;

  getToasts(): Observable<ToastMessage> {
    return this.toasts.asObservable();
  }

  success(title: string, message: string): void {
    this.toasts.next({ id: ++this.counter, type: 'success', title, message });
  }

  error(title: string, message: string): void {
    this.toasts.next({ id: ++this.counter, type: 'error', title, message });
  }

  info(title: string, message: string): void {
    this.toasts.next({ id: ++this.counter, type: 'info', title, message });
  }

  warning(title: string, message: string): void {
    this.toasts.next({ id: ++this.counter, type: 'warning', title, message });
  }
}
