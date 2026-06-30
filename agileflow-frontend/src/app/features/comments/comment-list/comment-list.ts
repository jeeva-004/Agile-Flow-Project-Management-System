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

Router,

RouterModule,

ActivatedRoute

}

from '@angular/router';

import {

CommentService

}

from '../../../core/services/comment.service';

@Component({

selector:

'app-comment-list',

standalone:true,

imports:[

CommonModule,

RouterModule

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

issueId!:number;

comments:any[]=[];

ngOnInit():void{

this.issueId=

Number(

this.route.snapshot

.paramMap

.get('id')

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

this.comments=

response.data;

}

});

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

delete(

id:number

):void{

if(

!confirm(

'Delete comment?'

)

){

return;

}

this.service

.delete(

id

)

.subscribe({

next:()=>{

this.load();

}

});

}

}