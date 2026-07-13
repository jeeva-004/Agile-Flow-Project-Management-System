import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ProjectMemberService } from '../../core/services/project-member.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './project-members.html',
  styleUrl: './project-members.scss'
})

export class ProjectMembersComponent

implements OnInit {

private readonly service =

inject(

ProjectMemberService);

private readonly userService =

inject(

UserService);

private readonly route =

inject(

ActivatedRoute);

private readonly fb =

inject(

FormBuilder);

private readonly toastService = inject(ToastService);
private readonly dialogService = inject(DialogService);

projectId!: number;

members:any[]=[];

usersList:any[]=[];

form = this.fb.group({

userId:[

null as any,

Validators.required

]

});

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  sortBy = 'id';
  sortDir = 'desc';

  ngOnInit(): void {
    this.projectId = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.userService.findAll(0, 100).subscribe({
      next: (res) => {
        this.usersList = res.data?.content ?? [];
      }
    });
    this.load();
  }

load(): void {

this.service

.findByProject(

this.projectId,
this.page,
this.size,
this.sortBy,
this.sortDir)

.subscribe({

next: response => {

this.members =

            response.data?.content ?? response.content ?? [];
          this.totalPages = response.data?.totalPages ?? response.totalPages ?? 0;
          this.totalElements = response.data?.totalElements ?? response.totalElements ?? 0;

}

});

}

  onSortChange(field: string): void {
    this.sortBy = field;
    this.page = 0;
    this.load();
  }

  toggleSortDir(): void {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.page = 0;
    this.load();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
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
  this.toastService.success('Member Added', 'The member has been successfully added to the project.');
  this.load();
  this.form.reset();
},
error: () => {
  this.toastService.error('Error', 'Failed to add member to project.');
}

});

}

remove(

id:number

): void {
  this.dialogService.confirm({
    title: 'Remove Member',
    message: 'Are you sure you want to remove this member from the project?',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    intent: 'danger'
  }).subscribe(confirmed => {
    if (!confirmed) return;
    this.service
      .remove(id)
      .subscribe({
        next: () => {
          this.toastService.success('Member Removed', 'The member has been successfully removed.');
          this.load();
        },
        error: () => {
          this.toastService.error('Error', 'Failed to remove member.');
        }
      });
  });
}

}