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

import {

ActivatedRoute

}

from '@angular/router';

import {

ReactiveFormsModule,

FormBuilder,

Validators

}

from '@angular/forms';

import {

ProjectMemberService

}

from '../../core/services/project-member.service';

import { FormsModule } from '@angular/forms';

@Component({

selector:

'app-project-members',

standalone:true,

imports:[

CommonModule,

ReactiveFormsModule,
FormsModule

],

templateUrl:

'./project-members.html'

})

export class ProjectMembersComponent

implements OnInit {

private readonly service =

inject(

ProjectMemberService);

private readonly route =

inject(

ActivatedRoute);

private readonly fb =

inject(

FormBuilder);

projectId!: number;

members:any[]=[];

form = this.fb.group({

userId:[

'',

Validators.required

]

});

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

ngOnInit(): void {

this.projectId = Number(

this.route.snapshot

.paramMap

.get(

'id'

));

this.load();

}

load(): void {

this.service

.findByProject(

this.projectId,
this.page,
this.size,
this.sortBy,
this.sortDir)

.subscribe({

next: response => {

this.members =

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

submit(): void {

if (

this.form.invalid

) {

return;

}

const payload = {

projectId:

this.projectId,

userId:

Number(

this.form.value

.userId)

};

this.service

.add(

payload)

.subscribe({

next: () => {

this.load();

this.form.reset();

}

});

}

remove(

id:number

): void {

this.service

.remove(

id)

.subscribe({

next:()=>{

this.load();

}

});

}

}