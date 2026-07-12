import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  intent?: 'danger' | 'primary';
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogState = new Subject<ConfirmDialogConfig | null>();
  private dialogResult = new Subject<boolean>();

  getDialogState(): Observable<ConfirmDialogConfig | null> {
    return this.dialogState.asObservable();
  }

  confirm(config: ConfirmDialogConfig): Observable<boolean> {
    this.dialogState.next({
      ...config,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      intent: config.intent || 'primary'
    });
    return this.dialogResult.asObservable();
  }

  closeDialog(result: boolean): void {
    this.dialogState.next(null);
    this.dialogResult.next(result);
  }
}
