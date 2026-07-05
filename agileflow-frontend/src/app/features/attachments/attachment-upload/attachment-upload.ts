import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentService } from '../../../core/services/attachment.service';

@Component({

  selector: 'app-attachment-upload',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl:

    './attachment-upload.html'

})

export class AttachmentUpload {

  @Input()

  issueId!: number;

  selectedFile?: File;

  uploading = false;

  constructor(

    private service:

      AttachmentService

  ) { }

  onSelect(

    event: Event

  ): void {

    const input =

      event.target as HTMLInputElement;

    if (

      input.files &&

      input.files.length > 0

    ) {

      this.selectedFile =

        input.files[0];

    }

  }

  upload(): void {

    if (

      !this.selectedFile

    ) {

      return;

    }

    this.uploading = true;

    this.service

      .upload(

        this.issueId,

        this.selectedFile

      )

      .subscribe({

        next: () => {

          this.uploading =

            false;

          this.selectedFile =

            undefined;

        },

        error: () => {

          this.uploading =

            false;

        }

      });

  }

}