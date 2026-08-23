import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'success' | 'error' | 'info';
  confirmBtnClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private dialogState = new Subject<ConfirmationDialogData | null>();
  private dialogResult = new Subject<boolean>();

  public dialogState$ = this.dialogState.asObservable();

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    this.dialogResult = new Subject<boolean>();
    const state: ConfirmationDialogData = {
      type: 'confirm',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmBtnClass: 'btn-danger',
      ...data
    };
    this.dialogState.next(state);
    return this.dialogResult.asObservable();
  }

  success(title: string, message: string): Observable<boolean> {
    this.dialogResult = new Subject<boolean>();
    const state: ConfirmationDialogData = {
      title,
      message,
      type: 'success',
      confirmText: 'OK',
      confirmBtnClass: 'btn-success'
    };
    this.dialogState.next(state);
    return this.dialogResult.asObservable();
  }

  error(title: string, message: string): Observable<boolean> {
    this.dialogResult = new Subject<boolean>();
    const state: ConfirmationDialogData = {
      title,
      message,
      type: 'error',
      confirmText: 'OK',
      confirmBtnClass: 'btn-danger'
    };
    this.dialogState.next(state);
    return this.dialogResult.asObservable();
  }

  info(title: string, message: string): Observable<boolean> {
    this.dialogResult = new Subject<boolean>();
    const state: ConfirmationDialogData = {
      title,
      message,
      type: 'info',
      confirmText: 'OK',
      confirmBtnClass: 'btn-primary'
    };
    this.dialogState.next(state);
    return this.dialogResult.asObservable();
  }

  resolve(result: boolean): void {
    this.dialogResult.next(result);
    this.dialogResult.complete();
    this.dialogState.next(null);
  }
}
