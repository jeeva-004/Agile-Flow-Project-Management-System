import {
Component,
Input,
OnInit
}
from '@angular/core';

import {
CommonModule
}
from '@angular/common';

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

constructor(

private service:
ActivityService

){}

ngOnInit():void{

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