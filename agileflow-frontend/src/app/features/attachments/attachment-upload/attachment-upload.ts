import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentService } from '../../../core/services/attachment.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({

  selector: 'app-attachment-upload',

  standalone: true,

  imports: [

    CommonModule

  ],

  templateUrl:

    './attachment-upload.html',

  styleUrls: ['./attachment-upload.scss']

})

export class AttachmentUpload {

  @Input()

  issueId!: number;

  selectedFile?: File;

  uploading = false;

  constructor(
    private service: AttachmentService,
    private toastService: ToastService
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
          this.uploading = false;
          this.selectedFile = undefined;
          this.toastService.success('Upload Successful', 'The attachment has been uploaded.');
          // Optional: we can reload the list if we use an event emitter, but currently it seems it's handled differently or requires a page reload/subject.
        },
        error: () => {
          this.uploading = false;
          this.toastService.error('Upload Failed', 'There was an error uploading the attachment.');
        }
      });

  }

}