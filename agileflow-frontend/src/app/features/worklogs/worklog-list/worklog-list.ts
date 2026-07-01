import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule }
from '@angular/common';

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

    RouterModule

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

  worklogs:any[]=[];

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

        this.issueId

      )

      .subscribe({

        next:response=>{

          this.worklogs =

            response.data;

        }

      });

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