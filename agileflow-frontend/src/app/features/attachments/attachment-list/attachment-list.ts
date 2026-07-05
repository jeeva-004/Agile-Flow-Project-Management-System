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

  AttachmentService

}

  from '../../../core/services/attachment.service';

@Component({

  selector:

    'app-attachment-list',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl:

    './attachment-list.html'

})

export class AttachmentList

  implements OnInit {

  @Input()

  issueId!: number;

  attachments: any[] = [];

  constructor(

    private service:

      AttachmentService

  ) { }

  ngOnInit(): void {

    this.loadAttachments();

  }

  loadAttachments(): void {

    this.service

      .findByIssue(

        this.issueId

      )

      .subscribe({

        next: (res: any) => {

          this.attachments =

            res.data;

        }

      });

  }
download(
        id:number,
        fileName:string
):void{

    this.service.download(id)
        .subscribe(blob=>{

            const url =
                    URL.createObjectURL(blob);

            const a =
                    document.createElement('a');

            a.href = url;

            a.download = fileName;

            a.click();

        });

}
  remove(

    id: number

  ): void {

    this.service

      .delete(

        id

      )

      .subscribe({

        next: () => {

          this.loadAttachments();

        }

      });

  }

}