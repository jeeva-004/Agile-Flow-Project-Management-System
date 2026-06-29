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

RouterModule

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

this.projectId

)

.subscribe({

next:response=>{

this.issues=

response.data;

}

});

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