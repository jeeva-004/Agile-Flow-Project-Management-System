import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationDialogData } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  private confirmationService = inject(ConfirmationService);
  
  data: ConfirmationDialogData | null = null;
  private autoVanishTimer: any = null;

  ngOnInit(): void {
    this.confirmationService.dialogState$.subscribe(data => {
      this.clearAutoVanishTimer();
      this.data = data;

      // Result messages (success / error) vanish automatically after 3.5 seconds
      if (data && (data.type === 'success' || data.type === 'error')) {
        this.autoVanishTimer = setTimeout(() => {
          this.confirm();
        }, 3500);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAutoVanishTimer();
  }

  private clearAutoVanishTimer(): void {
    if (this.autoVanishTimer) {
      clearTimeout(this.autoVanishTimer);
      this.autoVanishTimer = null;
    }
  }

  confirm(): void {
    this.clearAutoVanishTimer();
    this.confirmationService.resolve(true);
  }

  cancel(): void {
    this.clearAutoVanishTimer();
    this.confirmationService.resolve(false);
  }

  closeModal(): void {
    if (this.data?.type === 'confirm') {
      this.cancel();
    } else {
      this.confirm();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    this.closeModal();
  }

  getBadgeClass(): string {
    switch (this.data?.type) {
      case 'success': return 'bg-success-subtle text-success';
      case 'error': return 'bg-danger-subtle text-danger';
      case 'info': return 'bg-info-subtle text-info';
      default: return 'bg-warning-subtle text-warning';
    }
  }

  getIconClass(): string {
    switch (this.data?.type) {
      case 'success': return 'bi bi-check-circle-fill fs-4';
      case 'error': return 'bi bi-x-circle-fill fs-4';
      case 'info': return 'bi bi-info-circle-fill fs-4';
      default: return 'bi bi-exclamation-triangle-fill fs-4';
    }
  }

  getTitleClass(): string {
    switch (this.data?.type) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      case 'info': return 'text-info';
      default: return 'text-dark';
    }
  }

  getToastBorderClass(): string {
    switch (this.data?.type) {
      case 'success': return 'border-success bg-white';
      case 'error': return 'border-danger bg-white';
      default: return 'border-primary bg-white';
    }
  }

  getToastIconColorClass(): string {
    switch (this.data?.type) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      default: return 'text-primary';
    }
  }
}
