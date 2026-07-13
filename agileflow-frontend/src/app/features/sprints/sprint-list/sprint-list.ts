import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  SprintService
} from '../../../core/services/sprint.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({

  selector: 'app-sprint-list',

  standalone: true,

  imports: [

    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl:

    './sprint-list.html'

})
export class SprintListComponent
implements OnInit {

  private readonly service =

    inject(SprintService);

  private readonly route =

    inject(ActivatedRoute);

  private readonly router =

    inject(Router);

  private readonly toastService = inject(ToastService);
  private readonly dialogService = inject(DialogService);

  projectId!: number;

  sprints: any[] = [];
  role: string | null = null;
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.projectId = Number(
      this.route.snapshot
        .paramMap
        .get('id')
    );

    this.load();
  }

  load(): void {

    this.service

      .findByProject(

        this.projectId,
        this.page,
        this.size,
        this.sortBy,
        this.sortDir

      )

      .subscribe({

        next: response => {

          this.sprints =

            response.data?.content ?? response.content ?? [];
          this.totalPages = response.data?.totalPages ?? response.totalPages ?? 0;
          this.totalElements = response.data?.totalElements ?? response.totalElements ?? 0;

        }

      });

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

  editSprint(
    id: number
  ): void {

    this.router.navigate([

      '/sprints',

      id,

      'edit'

    ]);

  }

  deleteSprint(id: number): void {
    this.dialogService.confirm({
      title: 'Delete Sprint',
      message: 'Are you sure you want to delete this sprint? All associated issues may be affected.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      intent: 'danger'
    }).subscribe(confirmed => {
      if (!confirmed) return;
      this.service.delete(id).subscribe({
        next: () => {
          this.toastService.success('Sprint Deleted', 'The sprint was successfully deleted.');
          this.load();
        },
        error: () => {
          this.toastService.error('Error', 'Failed to delete sprint.');
        }
      });
    });
  }
}