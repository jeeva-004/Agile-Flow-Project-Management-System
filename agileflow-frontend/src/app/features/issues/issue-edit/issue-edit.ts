import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  IssueService
} from '../../../core/services/issue.service';

import {
  SprintService
} from '../../../core/services/sprint.service';

import {
  ProjectMemberService
} from '../../../core/services/project-member.service';
import { AttachmentUpload } from '../../attachments/attachment-upload/attachment-upload';
import { AttachmentList } from '../../attachments/attachment-list/attachment-list';
import { ToastService } from '../../../core/services/toast.service';

@Component({

  selector:
    'app-issue-edit',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    AttachmentUpload,

    AttachmentList

  ],

  templateUrl:

    './issue-edit.html'

})
export class IssueEdit
  implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly issueService =
    inject(IssueService);

  private readonly sprintService =
    inject(SprintService);

  private readonly memberService =
    inject(ProjectMemberService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toastService = inject(ToastService);

  issueId!: number;

  projectId!: number;

  members: any[] = [];

  sprints: any[] = [];

  form = this.fb.group({

    title: [

      '',

      Validators.required

    ],

    description: [

      ''

    ],

    status: [

      'TODO'

    ],

    priority: [

      'HIGH'

    ],

    type: [

      'TASK'

    ],

    estimateHours: [

      0

    ],

    dueDate: [

      ''

    ],

    sprintId: [

      null

    ],

    assigneeId: [

      null

    ]

  });

  ngOnInit(): void {

    this.issueId = Number(

      this.route.snapshot

        .paramMap

        .get('id')

    );

    this.load();

  }

  load(): void {

    this.issueService

      .findById(

        this.issueId

      )

      .subscribe({

        next: response => {

          const issue =

            response.data;

          this.projectId =

            issue.projectId;

          this.form.patchValue(

            issue

          );

          this.loadMembers();

          this.loadSprints();

        }

      });

  }

  loadMembers(): void {

    this.memberService

      .findByProject(

        this.projectId

      )

      .subscribe({

        next: response => {

          this.members =
            response.data;
        }
      });

  }

  loadSprints(): void {

    this.sprintService

      .findByProject(

        this.projectId

      )

      .subscribe({

        next: response => {

          this.sprints =

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

    this.issueService.update(this.issueId, this.form.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Issue Updated', 'The issue was successfully updated.');
        this.router.navigate(['/projects', this.projectId, 'issues']);
      },
      error: error => {
        this.toastService.error('Error', 'Failed to update issue.');
        console.error(error);
      }
    });
  }

}