import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ProjectResponse } from '../models/project.model';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);

  projects: ProjectResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  isLoading = true;
  error = '';
  
  isAdminOrPM = false;
  searchKeyword = '';

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.isAdminOrPM = user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
      }
    });
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    const request = this.searchKeyword.trim() 
      ? this.projectService.searchProjects(this.searchKeyword, undefined, this.pageIndex, this.pageSize)
      : this.projectService.getProjects(this.pageIndex, this.pageSize);

    request.subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projects = res.data.content;
          this.totalElements = res.data.totalElements;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load projects';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadProjects();
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < Math.ceil(this.totalElements / this.pageSize)) {
      this.pageIndex = newPage;
      this.loadProjects();
    }
  }

  deleteProject(id: number): void {
    const project = this.projects.find(p => p.id === id);
    const projectName = project ? project.name : 'this project';
    this.confirmationService.confirm({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${projectName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.projectService.deleteProject(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.confirmationService.success('Success', 'Project deleted successfully.');
              this.loadProjects();
            }
          },
          error: (err) => {
            this.confirmationService.error('Action Failed', err.error?.message || 'Failed to delete project.');
          }
        });
      }
    });
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
