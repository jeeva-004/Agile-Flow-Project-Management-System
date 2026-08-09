import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private dialogState = new Subject<ConfirmationDialogData | null>();
  private dialogResult = new Subject<boolean>();

  public dialogState$ = this.dialogState.asObservable();

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    this.dialogState.next(data);
    return this.dialogResult.asObservable();
  }

  resolve(result: boolean): void {
    this.dialogResult.next(result);
    this.dialogState.next(null);
  }
}
