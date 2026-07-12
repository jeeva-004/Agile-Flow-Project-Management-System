import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, ConfirmDialogConfig } from '../../../core/services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  config: ConfirmDialogConfig | null = null;
  private subscription!: Subscription;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.subscription = this.dialogService.getDialogState().subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm(): void {
    this.dialogService.closeDialog(true);
  }

  onCancel(): void {
    this.dialogService.closeDialog(false);
  }
}
