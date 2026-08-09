import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SprintService } from '../services/sprint.service';
import { SprintResponse } from '../models/sprint.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sprint-list.component.html',
  styleUrl: './sprint-list.component.css'
})
export class SprintListComponent implements OnInit {
  private sprintService = inject(SprintService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);

  projectId!: number;
  sprints: SprintResponse[] = [];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  error = '';
  
  isAdminOrPM = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = +idParam;
      this.loadSprints();
    } else {
      this.error = 'Project ID is missing';
      this.isLoading = false;
    }

    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.isAdminOrPM = user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
      }
    });
  }

  loadSprints(): void {
    this.isLoading = true;
    this.sprintService.getSprintsByProject(this.projectId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.sprints = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load sprints';
        this.isLoading = false;
      }
    });
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadSprints();
    }
  }

  deleteSprint(id: number): void {
    this.confirmationService.confirm({
      title: 'Delete Sprint',
      message: 'Are you sure you want to delete this sprint?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.sprintService.deleteSprint(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.loadSprints();
            }
          },
          error: () => {
            alert('Failed to delete sprint.');
          }
        });
      }
    });
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
