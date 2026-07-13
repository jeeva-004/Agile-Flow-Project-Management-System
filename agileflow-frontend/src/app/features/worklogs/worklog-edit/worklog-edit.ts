import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkLogService } from '../../../core/services/worklog.service';

@Component({
  selector: 'app-worklog-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './worklog-edit.html',
  styleUrls: ['./worklog-edit.scss']
})
export class WorkLogEditComponent
implements OnInit {

private readonly fb =

inject(

FormBuilder

);

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

id!:number;

issueId!:number;

form = this.fb.group({

hoursSpent:[

0,

Validators.required

],

description:[

''

],

workDate:[

'',

Validators.required

]

});

ngOnInit():void{

this.id =

Number(

this.route.snapshot

.paramMap

.get(

'id'

)

);

this.load();

}

load():void{

this.service

.findById(

this.id

)

.subscribe({

next:response=>{

const worklog =

response.data;

this.issueId =

worklog.issueId;

this.form.patchValue({

hoursSpent:

worklog.hoursSpent,

description:

worklog.description,

workDate:

worklog.workDate

});

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

this.id,

this.form

.getRawValue()

)

.subscribe({

next:()=>{

this.router.navigate([

'/issues',

this.issueId,

'worklogs'

]);

}

});

}

}