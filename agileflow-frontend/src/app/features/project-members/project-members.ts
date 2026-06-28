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

@Component({

selector:

'app-project-members',

standalone:true,

imports:[

CommonModule,

ReactiveFormsModule

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

this.projectId)

.subscribe({

next: response => {

this.members =

response.data;

}

});

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