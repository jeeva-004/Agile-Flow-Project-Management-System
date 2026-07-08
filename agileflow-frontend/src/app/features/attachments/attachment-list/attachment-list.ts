import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttachmentService } from '../../../core/services/attachment.service';

@Component({
  selector: 'app-attachment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attachment-list.html'
})

export class AttachmentList

  implements OnInit {

  @Input()

  issueId!: number;

  attachments: any[] = [];

  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  constructor(
    private service: AttachmentService
  ) { }

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    this.service
      .findByIssue(this.issueId, this.page, this.size, this.sortBy, this.sortDir)
      .subscribe({
        next: (res: any) => {
          this.attachments = res.data?.content ?? res.content ?? res.data ?? [];
          this.totalPages = res.data?.totalPages ?? res.totalPages ?? 0;
          this.totalElements = res.data?.totalElements ?? res.totalElements ?? 0;
        }
      });
  }

  formatBytes(bytes: number, decimals: number = 2): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.loadAttachments();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.loadAttachments();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadAttachments();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadAttachments();
    }
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