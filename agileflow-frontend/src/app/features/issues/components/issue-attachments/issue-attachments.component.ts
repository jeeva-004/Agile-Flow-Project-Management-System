import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentResponse } from '../../models/attachment.model';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
@Component({
  selector: 'app-issue-attachments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-attachments.component.html',
  styleUrl: './issue-attachments.component.css'
})
export class IssueAttachmentsComponent implements OnInit {
  @Input() issueId!: number;

  private attachmentService = inject(AttachmentService);
  private confirmationService = inject(ConfirmationService);

  attachments: AttachmentResponse[] = [];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  isUploading = false;

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    this.isLoading = true;
    this.attachmentService.getAttachmentsByIssue(this.issueId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.attachments = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
    event.target.value = '';
  }

  uploadFile(file: File): void {
    this.isUploading = true;
    this.attachmentService.uploadAttachment(this.issueId, file).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadAttachments();
        }
        this.isUploading = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to upload file.');
        this.isUploading = false;
      }
    });
  }

  downloadAttachment(id: number, fileName: string): void {
    this.attachmentService.downloadAttachment(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to download file.');
      }
    });
  }

  deleteAttachment(id: number): void {
    this.confirmationService.confirm({
      title: 'Delete Attachment',
      message: 'Delete this attachment?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.attachmentService.deleteAttachment(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.loadAttachments();
            }
          },
          error: (err) => {
            alert(err.error?.message || 'Failed to delete attachment.');
          }
        });
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadAttachments();
    }
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
