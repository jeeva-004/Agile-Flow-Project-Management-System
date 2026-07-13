import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkLogService } from '../../../core/services/worklog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-worklog-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './worklog-create.html',
  styleUrls: ['./worklog-create.scss']
})
export class WorkLogCreateComponent implements OnInit {

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

private readonly toastService = inject(ToastService);

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

this.issueId =

Number(

this.route.snapshot

.paramMap

.get(

'issueId'

)

);

}

submit():void{

if(

this.form.invalid

){

return;

}

this.service.create(this.issueId, this.form.getRawValue()).subscribe({
  next: () => {
    this.toastService.success('Work Logged', 'Your work log was successfully added.');
    this.router.navigate(['/issues', this.issueId, 'worklogs']);
  },
  error: () => {
    this.toastService.error('Error', 'Failed to add work log.');
  }
});

}

}