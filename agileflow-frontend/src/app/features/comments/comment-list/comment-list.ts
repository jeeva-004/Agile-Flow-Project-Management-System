import {

Component,

inject,

OnInit

}

from '@angular/core';

import {

CommonModule

}

from '@angular/common';

import { FormsModule } from '@angular/forms';

import {

Router,

RouterModule,

ActivatedRoute

}

from '@angular/router';

import {

CommentService

}

from '../../../core/services/comment.service';
import { ToastService } from '../../../core/services/toast.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({

selector:

'app-comment-list',

standalone:true,

imports:[

CommonModule,
RouterModule,
FormsModule

],

templateUrl:

'./comment-list.html'

})
export class CommentListComponent
implements OnInit {

private readonly service=

inject(CommentService);

private readonly route=

inject(ActivatedRoute);

private readonly router=

inject(Router);

private readonly toastService = inject(ToastService);
private readonly dialogService = inject(DialogService);

  issueId!:number;
  projectId!:number;

  comments: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('current_project_id'));
    this.issueId = Number(
      this.route.snapshot
        .paramMap
        .get('id')
    );

    this.load();
  }

load():void{

this.service

.findByIssue(

this.issueId,
this.page,
this.size,
this.sortBy,
this.sortDir

)

.subscribe({

next:response=>{

this.comments=

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

edit(

id:number

):void{

this.router.navigate([

'/comments',

id,

'edit'

]);

}

delete(id:number):void{
  this.dialogService.confirm({
    title: 'Delete Comment',
    message: 'Are you sure you want to delete this comment? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    intent: 'danger'
  }).subscribe(confirmed => {
    if (!confirmed) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.toastService.success('Comment Deleted', 'The comment was successfully deleted.');
        this.load();
      },
      error: () => {
        this.toastService.error('Error', 'Failed to delete comment.');
      }
    });
  });
}

}