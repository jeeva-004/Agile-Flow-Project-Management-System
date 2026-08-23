import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommentResponse } from '../../models/comment.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

@Component({
  selector: 'app-issue-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './issue-comments.component.html',
  styleUrl: './issue-comments.component.css'
})
export class IssueCommentsComponent implements OnInit {
  @Input() issueId!: number;

  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);

  comments: CommentResponse[] = [];
  commentForm!: FormGroup;
  editForm!: FormGroup;
  editingCommentId: number | null = null;
  
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;
  isLoading = true;
  isSubmitting = false;
  
  currentUserId?: number;

  ngOnInit(): void {
    this.initForm();
    this.loadComments();
  }

  private initForm(): void {
    this.commentForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.editForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getCommentsByIssue(this.issueId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.comments = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    const message = this.commentForm.value.message?.trim();
    if (!message || this.commentForm.invalid) return;

    this.isSubmitting = true;
    const request = { message };
    
    this.commentService.createComment(this.issueId, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentForm.reset();
          this.confirmationService.success('Success', 'Comment posted successfully.');
          this.pageIndex = 0;
          this.loadComments();
        } else {
          this.confirmationService.error('Action Failed', res.message || 'Failed to post comment.');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.confirmationService.error('Action Failed', err.error?.message || 'Failed to post comment.');
        this.isSubmitting = false;
      }
    });
  }

  startEdit(comment: CommentResponse): void {
    this.editingCommentId = comment.id;
    this.editForm.patchValue({ message: comment.message });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editForm.reset();
  }

  submitEdit(id: number): void {
    const message = this.editForm.value.message?.trim();
    if (!message || this.editForm.invalid) return;

    const request = { message };
    this.commentService.updateComment(id, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingCommentId = null;
          this.confirmationService.success('Success', 'Comment updated successfully.');
          this.loadComments();
        } else {
          this.confirmationService.error('Action Failed', res.message || 'Failed to update comment.');
        }
      },
      error: (err) => {
        this.confirmationService.error('Action Failed', err.error?.message || 'Failed to update comment.');
      }
    });
  }

  deleteComment(id: number): void {
    this.confirmationService.confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.commentService.deleteComment(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'Comment deleted successfully.');
              this.loadComments();
            }
          },
          error: (err) => {
            this.confirmationService.error('Action Failed', err.error?.message || 'Failed to delete comment.');
          }
        });
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadComments();
    }
  }
}
