import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueHistoryService } from '../../../../core/services/issue-history.service';
import { IssueHistoryResponse } from '../../../../core/models/issue-history.model';

@Component({
  selector: 'app-issue-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-history.component.html',
  styleUrl: './issue-history.component.css'
})
export class IssueHistoryComponent implements OnInit {
  @Input() issueId!: number;

  private historyService = inject(IssueHistoryService);

  historyLogs: IssueHistoryResponse[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    if (this.issueId) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.isLoading = true;
    this.historyService.getIssueHistory(this.issueId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.historyLogs = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load issue history.';
        this.isLoading = false;
      }
    });
  }

  getIcon(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return '✨';
    if (actionLower.includes('update')) return '✏️';
    if (actionLower.includes('status')) return '🔄';
    if (actionLower.includes('assign')) return '👤';
    if (actionLower.includes('comment')) return '💬';
    if (actionLower.includes('delete')) return '🗑️';
    return '📝';
  }
}
