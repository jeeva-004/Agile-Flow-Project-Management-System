import {
  Component,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IssueService } from '../../../core/services/issue.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.scss'
})
export class IssueListComponent implements OnInit, OnDestroy {
  private readonly service = inject(IssueService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);

  projectId!: number;
  issues: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  keyword = '';
  statusFilter = '';
  priorityFilter = '';

  currentUserId: number | null = null;
  role: string | null = null;

  private readonly searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    const cachedId = localStorage.getItem('current_user_id');
    if (cachedId) {
      this.currentUserId = Number(cachedId);
    }
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.keyword = value;
      this.page = 0;
      this.load();
    });

    this.load();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  load(): void {
    this.service
      .search(
        this.projectId,
        this.keyword || undefined,
        this.statusFilter || undefined,
        this.priorityFilter || undefined,
        undefined, // assigneeId
        this.page,
        this.size,
        this.sortBy,
        this.sortDir
      )
      .subscribe({
        next: response => {
          this.issues = response.data?.content ?? [];
          this.totalPages = response.data?.totalPages ?? 0;
          this.totalElements = response.data?.totalElements ?? 0;
        },
        error: err => {
          console.error('Failed to load issues:', err);
          this.issues = [];
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.page = 0;
    this.load();
  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.load();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.load();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  editIssue(id: number): void {
    this.router.navigate(['/issues', id, 'edit']);
  }

  deleteIssue(id: number): void {
    this.dialogService.confirm({
      title: 'Delete Issue',
      message: 'Are you sure you want to delete this issue? This action cannot be undone.',
      confirmText: 'Delete',
      intent: 'danger'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.service.delete(id).subscribe({
        next: () => {
          this.toastService.success('Issue Deleted', 'The issue has been successfully deleted.');
          this.load();
        },
        error: error => {
          this.toastService.error('Error', 'Failed to delete issue.');
          console.error(error);
        }
      });
    });
  }
}