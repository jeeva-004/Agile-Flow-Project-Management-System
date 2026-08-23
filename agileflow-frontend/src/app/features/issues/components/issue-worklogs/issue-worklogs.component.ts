import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkLogService } from '../../services/worklog.service';
import { WorkLogResponse } from '../../models/worklog.model';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

@Component({
  selector: 'app-issue-worklogs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './issue-worklogs.component.html',
  styleUrl: './issue-worklogs.component.css'
})
export class IssueWorklogsComponent implements OnInit {
  @Input() issueId!: number;

  private workLogService = inject(WorkLogService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  worklogs: WorkLogResponse[] = [];
  workLogForm!: FormGroup;
  editForm!: FormGroup;
  editingWorkLogId: number | null = null;
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  isSubmitting = false;
  
  totalHours = 0;

  ngOnInit(): void {
    this.initForm();
    this.loadWorkLogs();
  }

  private initForm(): void {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.workLogForm = this.fb.group({
      hoursSpent: [1, [Validators.required, Validators.min(0.1)]],
      workDate: [today, [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.editForm = this.fb.group({
      hoursSpent: [1, [Validators.required, Validators.min(0.1)]],
      workDate: [today, [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  loadWorkLogs(): void {
    this.isLoading = true;
    this.workLogService.getWorkLogsByIssue(this.issueId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.worklogs = res.data.content;
          this.totalElements = res.data.totalElements;
          this.calculateTotalHours();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  private calculateTotalHours(): void {
    this.totalHours = this.worklogs.reduce((sum, log) => sum + log.hoursSpent, 0);
  }

  onSubmit(): void {
    if (this.workLogForm.invalid) return;

    this.isSubmitting = true;
    const request = { 
      hoursSpent: this.workLogForm.value.hoursSpent,
      workDate: this.workLogForm.value.workDate,
      description: this.workLogForm.value.description?.trim()
    };
    
    this.workLogService.createWorkLog(this.issueId, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.initForm();
          this.confirmationService.success('Success', 'Work log saved successfully.');
          this.loadWorkLogs();
        } else {
          this.confirmationService.error('Action Failed', res.message || 'Failed to log work.');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.confirmationService.error('Action Failed', err.error?.message || 'Failed to log work.');
        this.isSubmitting = false;
      }
    });
  }

  startEdit(log: WorkLogResponse): void {
    this.editingWorkLogId = log.id;
    this.editForm.patchValue({
      hoursSpent: log.hoursSpent,
      workDate: log.workDate.split('T')[0],
      description: log.description
    });
  }

  cancelEdit(): void {
    this.editingWorkLogId = null;
    this.editForm.reset();
  }

  submitEdit(id: number): void {
    if (this.editForm.invalid) return;

    const request = {
      hoursSpent: this.editForm.value.hoursSpent,
      workDate: this.editForm.value.workDate,
      description: this.editForm.value.description?.trim()
    };
    
    this.workLogService.updateWorkLog(id, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingWorkLogId = null;
          this.confirmationService.success('Success', 'Work log updated successfully.');
          this.loadWorkLogs();
        } else {
          this.confirmationService.error('Action Failed', res.message || 'Failed to update work log.');
        }
      },
      error: (err) => {
        this.confirmationService.error('Action Failed', err.error?.message || 'Failed to update work log.');
      }
    });
  }

  deleteWorkLog(id: number): void {
    this.confirmationService.confirm({
      title: 'Delete Work Log',
      message: 'Are you sure you want to delete this work log?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.workLogService.deleteWorkLog(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'Work log deleted successfully.');
              this.loadWorkLogs();
            }
          },
          error: (err) => {
            this.confirmationService.error('Action Failed', err.error?.message || 'Failed to delete work log.');
          }
        });
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadWorkLogs();
    }
  }
}
