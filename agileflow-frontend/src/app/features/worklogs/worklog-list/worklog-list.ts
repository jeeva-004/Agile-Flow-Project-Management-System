import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule
}
from '@angular/router';

import {
  WorkLogService
}
from '../../../core/services/worklog.service';

@Component({

  selector:
  'app-worklog-list',

  standalone:true,

  imports:[

    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl:

    './worklog-list.html'

})
export class WorkLogListComponent
implements OnInit {

  private readonly service =

    inject(
      WorkLogService
    );

  private readonly route =

    inject(
      ActivatedRoute
    );

  private readonly router =

    inject(
      Router
    );

  issueId!:number;

  worklogs: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit():void{

    this.issueId =

      Number(

        this.route.snapshot.paramMap

        .get('issueId')

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

          this.worklogs =

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

  create():void{

    this.router.navigate([

      '/issues',

      this.issueId,

      'worklogs',

      'create'

    ]);

  }

  edit(

      id:number

  ):void{

    this.router.navigate([

      '/worklogs',

      id,

      'edit'

    ]);

  }

  delete(

      id:number

  ):void{

    const confirmed =

      confirm(

        'Delete worklog?'

      );

    if(

      !confirmed

    ){

      return;

    }

    this.service

      .delete(id)

      .subscribe({

        next:()=>{

          this.load();

        }

      });

  }

}