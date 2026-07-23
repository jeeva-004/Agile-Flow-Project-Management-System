import {
  Component,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import { ProjectService }
  from '../../../core/services/project.service';
import { DialogService } from '../../../core/services/dialog.service';
import { ToastService } from '../../../core/services/toast.service';


@Component({

  selector: 'app-project-list',

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    RouterModule

  ],

  templateUrl:
    './project-list.html',
  styleUrl: './project-list.scss'

})
export class ProjectListComponent
  implements OnInit, OnDestroy {

  private readonly service =
    inject(ProjectService);

  private readonly router =
    inject(Router);

  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);

  projects: any[] = [];
  role: string | null = null;

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  keyword = '';
  statusFilter = '';

  private readonly searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.keyword = value;
      this.page = 0;
      this.loadProjects();
    });
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.page = 0;
    this.loadProjects();
  }

  filteredProjects(): any[] {
    if (!this.statusFilter) return this.projects;
    return this.projects.filter((p: any) =>
      (p.status || 'Active').toLowerCase() === this.statusFilter.toLowerCase()
    );
  }

  loadProjects(): void {
    if (this.keyword) {
      this.service.search(this.keyword, undefined, this.page, this.size, this.sortBy, this.sortDir)
        .subscribe({
          next: response => {
            this.projects = response.data?.content ?? [];
            this.totalPages = response.data?.totalPages ?? 0;
            this.totalElements = response.data?.totalElements ?? 0;
          }
        });
    } else {
      this.service.findAll(this.page, this.size, this.sortBy, this.sortDir)
        .subscribe({
          next: response => {
            this.projects = response.data?.content ?? [];
            this.totalPages = response.data?.totalPages ?? 0;
            this.totalElements = response.data?.totalElements ?? 0;
          }
        });
    }
  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.loadProjects();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.loadProjects();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadProjects();
    }
  }

  editProject(
    id: number
  ): void {

    this.router.navigate([

      '/projects',

      id,

      'edit'

    ]);

  }

  deleteProject(
    id: number
  ): void {
    this.dialogService.confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      confirmText: 'Delete',
      intent: 'danger'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      
      this.service.delete(id).subscribe({
        next: () => {
          this.toastService.success('Project Deleted', 'The project has been successfully deleted.');
          this.loadProjects();
        },
        error: error => {
          this.toastService.error('Error', 'Failed to delete project.');
          console.error(error);
        }
      });
    });
  }

}