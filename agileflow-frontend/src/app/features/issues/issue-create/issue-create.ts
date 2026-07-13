import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
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
import { ToastService } from '../../../core/services/toast.service';

@Component({

  selector:
    'app-issue-create',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule

  ],

  templateUrl:
    './issue-create.html'

})
export class IssueCreate
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

    priority: [

      'HIGH',

      Validators.required

    ],

    type: [

      'TASK',

      Validators.required

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

    this.projectId = Number(

      this.route.snapshot

        .paramMap

        .get('id')

    );

    this.loadMembers();

    this.loadSprints();

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

    const request = {

      ...this.form.getRawValue(),

      projectId:

        this.projectId

    };

    this.issueService.create(request).subscribe({
      next: () => {
        this.toastService.success('Issue Created', 'The issue was successfully created.');
        this.router.navigate(['/projects', this.projectId, 'issues']);
      },
      error: error => {
        this.toastService.error('Error', 'Failed to create issue.');
        console.error(error);
      }
    });
  }

}