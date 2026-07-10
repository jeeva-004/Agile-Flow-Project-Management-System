import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '../../../core/services/comment.service';

@Component({
  selector: 'app-comment-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './comment-edit.html'
})
export class CommentEditComponent
implements OnInit{

private readonly fb=

inject(FormBuilder);

private readonly service=

inject(CommentService);

private readonly route=

inject(ActivatedRoute);

private readonly router=

inject(Router);

commentId!:number;

issueId!:number;

form=

this.fb.group({

message:[

'',

Validators.required

]

});

ngOnInit():void{

this.commentId=

Number(

this.route.snapshot

.paramMap

.get('id')

);

this.load();

}

load():void{

this.service

.findById(

this.commentId

)

.subscribe({

next:response=>{

const comment=

response.data;

this.issueId=

comment.issueId;

this.form.patchValue(

comment

);

}

});

}

submit():void{

if(

this.form.invalid

){

return;

}

this.service

.update(

this.commentId,

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