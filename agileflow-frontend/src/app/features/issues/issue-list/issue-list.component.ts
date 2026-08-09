import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssueService } from '../services/issue.service';
import { IssueResponse } from '../models/issue.model';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.css'
})
export class IssueListComponent implements OnInit {
  private issueService = inject(IssueService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  projectId!: number;
  issues: IssueResponse[] = [];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  
  isLoading = true;
  error = '';
  
  canManage = false;
  searchKeyword = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = +idParam;
      this.loadIssues();
    } else {
      this.error = 'Project ID is missing';
      this.isLoading = false;
    }

    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.canManage = user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
      }
    });
  }

  loadIssues(): void {
    this.isLoading = true;
    const request = this.searchKeyword.trim()
      ? this.issueService.searchIssues(this.projectId, this.searchKeyword, undefined, undefined, undefined, this.pageIndex, this.pageSize)
      : this.issueService.getIssuesByProject(this.projectId, this.pageIndex, this.pageSize);

    request.subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.issues = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load issues';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadIssues();
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadIssues();
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
