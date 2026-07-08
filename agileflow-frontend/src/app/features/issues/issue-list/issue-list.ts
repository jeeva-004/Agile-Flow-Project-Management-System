import {

Component,

OnInit,

inject

}

from '@angular/core';

import {

CommonModule

}

from '@angular/common';

import {

FormsModule

}

from '@angular/forms';

import {

Router,

RouterModule,

ActivatedRoute

}

from '@angular/router';

import {

IssueService

}

from '../../../core/services/issue.service';

@Component({

selector:

'app-issue-list',

standalone:true,

imports:[

CommonModule,

RouterModule,

FormsModule

],

templateUrl:

'./issue-list.html'

})
export class IssueListComponent
implements OnInit{

private readonly service=

inject(IssueService);

private readonly route=

inject(ActivatedRoute);

private readonly router=

inject(Router);

projectId!:number;

issues:any[]=[];

page=0;

size=10;

totalPages=0;

totalElements=0;

sortBy='id';

sortDir='desc';

ngOnInit():void{

this.projectId=

Number(

this.route.snapshot

.paramMap

.get('id')

);

this.load();

}

load():void{

this.service

.findByProject(

this.projectId,

this.page,

this.size,

this.sortBy,

this.sortDir

)

.subscribe({

next:response=>{

this.issues=

response.data?.content ?? [];

this.totalPages=

response.data?.totalPages ?? 0;

this.totalElements=

response.data?.totalElements ?? 0;

},

error:err=>{

console.error('Failed to load issues:',err);

this.issues=[];

}

});

}

onSortChange(field:string):void{

this.sortBy=field;

this.page=0;

this.load();

}

toggleSortDir():void{

this.sortDir=

this.sortDir==='asc'?'desc':'asc';

this.page=0;

this.load();

}

nextPage():void{

if(this.page+1<this.totalPages){

this.page++;

this.load();

}

}

prevPage():void{

if(this.page>0){

this.page--;

this.load();

}

}

editIssue(
id:number
):void{

this.router.navigate([

'/issues',

id,

'edit'

]);

}

deleteIssue(
id:number
):void{

if(

!confirm(

'Delete issue?'

)

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