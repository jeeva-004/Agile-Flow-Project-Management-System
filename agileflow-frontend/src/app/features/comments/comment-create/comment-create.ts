import {

Component,

inject

}

from '@angular/core';

import {

CommonModule

}

from '@angular/common';

import {

ReactiveFormsModule,

FormBuilder,

Validators

}

from '@angular/forms';

import {

ActivatedRoute,

Router

}

from '@angular/router';

import {

CommentService

}

from '../../../core/services/comment.service';

@Component({

selector:

'app-comment-create',

standalone:true,

imports:[

CommonModule,

ReactiveFormsModule

],

templateUrl:

'./comment-create.html'

})
export class CommentCreateComponent {

private readonly fb=

inject(FormBuilder);

private readonly service=

inject(CommentService);

private readonly route=

inject(ActivatedRoute);

private readonly router=

inject(Router);

issueId!:number;

form=

this.fb.group({

message:[

'',

Validators.required

]

});

ngOnInit(){

this.issueId=

Number(

this.route.snapshot

.paramMap

.get('id')

);

}

submit():void{

if(

this.form.invalid

){

return;

}

this.service

.create(

this.issueId,

this.form.getRawValue()

)

.subscribe({

next:()=>{

this.router.navigate([

'/issues',

this.issueId,

'comments'

]);

}

});

}

}