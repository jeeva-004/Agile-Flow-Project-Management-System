import {
Component,
Input,
OnInit,
inject
}
from '@angular/core';

import {
CommonModule
}
from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {
ActivityService
}
from '../../../core/services/activity.service';

@Component({

selector:'app-activity-feed',

standalone:true,

imports:[
CommonModule
],

templateUrl:
'./activity-feed.html',
styleUrls: ['./activity-feed.scss']
})

export class ActivityFeed
implements OnInit {

@Input()
projectId!:number;

activities:any[]=[];

loading=false;

private readonly route = inject(ActivatedRoute);

constructor(

private service:
ActivityService

){}

ngOnInit():void{
  if (!this.projectId) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = Number(idParam);
    }
  }
  this.load();
}

load():void{

if(!this.projectId){

return;

}

this.loading=true;

this.service

.findByProject(

this.projectId

)

.subscribe({

next:(res:any)=>{

this.activities=

res.data || [];

this.loading=

false;

},

error:()=>{

this.loading=

false;

}

});

}

}