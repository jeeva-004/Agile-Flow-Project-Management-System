import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationDialogData } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);
  
  data: ConfirmationDialogData | null = null;

  ngOnInit(): void {
    this.confirmationService.dialogState$.subscribe(data => {
      this.data = data;
    });
  }

  confirm(): void {
    this.confirmationService.resolve(true);
  }

  cancel(): void {
    this.confirmationService.resolve(false);
  }
}
