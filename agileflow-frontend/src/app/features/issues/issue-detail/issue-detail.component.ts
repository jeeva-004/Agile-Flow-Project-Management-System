import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IssueService } from '../services/issue.service';
import { IssueResponse } from '../models/issue.model';
import { IssueCommentsComponent } from '../components/issue-comments/issue-comments.component';
import { IssueAttachmentsComponent } from '../components/issue-attachments/issue-attachments.component';
import { IssueWorklogsComponent } from '../components/issue-worklogs/issue-worklogs.component';
import { IssueHistoryComponent } from '../components/issue-history/issue-history.component';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IssueCommentsComponent, IssueAttachmentsComponent, IssueWorklogsComponent, IssueHistoryComponent],
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})
export class IssueDetailComponent implements OnInit {
  private issueService = inject(IssueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);

  issueId!: number;
  projectId!: number;
  issue?: IssueResponse;
  isLoading = true;
  error = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    
    if (idParam && projectIdParam) {
      this.issueId = +idParam;
      this.projectId = +projectIdParam;
      this.loadIssue();
    } else {
      this.error = 'Invalid route parameters';
    }
  }

  loadIssue(): void {
    this.isLoading = true;
    this.issueService.getIssue(this.issueId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.issue = res.data;
        } else {
          this.error = 'Issue not found';
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load issue';
        this.isLoading = false;
      }
    });
  }

  deleteIssue(): void {
    const title = this.issue?.title ? `"${this.issue.title}"` : 'this issue';
    this.confirmationService.confirm({
      title: 'Delete Issue',
      message: `Are you sure you want to delete ${title}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.issueService.deleteIssue(this.issueId).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'Issue deleted successfully.').subscribe(() => {
                this.router.navigate(['/projects', this.projectId, 'issues']);
              });
            }
          },
          error: (err) => {
            this.confirmationService.error('Action Failed', err.error?.message || 'Failed to delete issue.');
          }
        });
      }
    });
  }
}
