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
    
    // We get role from auth, but user id might be needed for edit/delete permissions
    // Our token doesn't have ID according to previous knowledge, but maybe the backend allows author to delete?
    // Actually, backend might enforce it via security. 
    // We will just show delete button and let backend reject if not authorized, or we can just show it for ADMIN/PM.
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
          // Typically we want older comments first, but let's just reverse the desc sort from backend, 
          // or just display as is (newest first). Let's display as is.
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
    if (this.commentForm.invalid) return;

    this.isSubmitting = true;
    const request = { message: this.commentForm.value.message };
    
    this.commentService.createComment(this.issueId, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentForm.reset();
          // Reload to get the new comment
          this.pageIndex = 0;
          this.loadComments();
        }
        this.isSubmitting = false;
      },
      error: () => {
        alert('Failed to post comment.');
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
    if (this.editForm.invalid) return;

    const request = { message: this.editForm.value.message };
    this.commentService.updateComment(id, request).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingCommentId = null;
          this.loadComments();
        }
      },
      error: () => {
        alert('Failed to update comment.');
      }
    });
  }

  deleteComment(id: number): void {
    this.confirmationService.confirm({
      title: 'Delete Comment',
      message: 'Delete this comment?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.commentService.deleteComment(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.loadComments();
            }
          },
          error: () => {
            alert('Failed to delete comment.');
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
