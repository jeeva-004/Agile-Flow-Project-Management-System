import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssuePriority, IssueStatus, IssueType } from '../../models/issue.model';
import { ProjectMemberService } from '../../../projects/services/project-member.service';
import { ProjectMemberResponse } from '../../../projects/models/project-member.model';
import { SprintService } from '../../../sprints/services/sprint.service';
import { SprintResponse } from '../../../sprints/models/sprint.model';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './issue-form.component.html',
  styleUrl: './issue-form.component.css'
})
export class IssueFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private issueService = inject(IssueService);
  private projectMemberService = inject(ProjectMemberService);
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  issueForm!: FormGroup;
  isEditMode = false;
  issueId?: number;
  projectId!: number;
  isLoading = false;
  error = '';

  projectMembers: ProjectMemberResponse[] = [];
  projectSprints: SprintResponse[] = [];

  // Enums for template
  issueTypes = Object.values(IssueType);
  issuePriorities = Object.values(IssuePriority);
  issueStatuses = Object.values(IssueStatus);

  ngOnInit(): void {
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    if (!projectIdParam) {
      this.error = 'Project ID is missing';
      return;
    }
    this.projectId = +projectIdParam;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.issueId = +idParam;
    }

    this.initForm();
    this.loadDependencies();

    if (this.isEditMode) {
      this.loadIssue();
    }
  }

  private initForm(): void {
    this.issueForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [IssueType.TASK, Validators.required],
      priority: [IssuePriority.MEDIUM, Validators.required],
      status: [IssueStatus.TODO], // Only relevant on edit typically, or defaults to TODO
      assigneeId: [null],
      sprintId: [null],
      estimateHours: [null, [Validators.min(0)]],
      dueDate: ['']
    });

    if (!this.isEditMode) {
      this.issueForm.get('status')?.disable(); // Can't change status on creation usually, or we just default it
    }
  }

  private loadDependencies(): void {
    // Load members for assignee dropdown
    this.projectMemberService.getMembersByProject(this.projectId, 0, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projectMembers = res.data.content;
        }
      }
    });

    // Load sprints for sprint dropdown
    this.sprintService.getSprintsByProject(this.projectId, 0, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projectSprints = res.data.content;
        }
      }
    });
  }

  private loadIssue(): void {
    if (!this.issueId) return;
    this.isLoading = true;
    this.issueService.getIssue(this.issueId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.issueForm.patchValue({
            title: res.data.title,
            description: res.data.description,
            type: res.data.type,
            priority: res.data.priority,
            status: res.data.status,
            assigneeId: res.data.assigneeId,
            sprintId: res.data.sprintId,
            estimateHours: res.data.estimateHours,
            dueDate: res.data.dueDate
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load issue';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.issueForm.invalid) return;

    this.isLoading = true;
    const formValue = this.issueForm.getRawValue(); // use getRawValue to include disabled fields if any
    
    const payload = { ...formValue, projectId: this.projectId };
    
    // Ensure status is handled correctly on create
    if (!this.isEditMode) {
      delete payload.status; // backend handles default
    }

    const request = this.isEditMode ? 
      this.issueService.updateIssue(this.issueId!, payload) : 
      this.issueService.createIssue(payload);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          // Go back to the issue details or the list
          this.router.navigate(['/projects', this.projectId, 'issues', res.data?.id || '']);
        } else {
          this.error = res.message || 'Operation failed';
        }
        this.isLoading = false;
      },
      error: (err) => {
        if (err.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          this.error = err.error.errors.join(', ');
        } else {
          this.error = err.error?.message || 'Operation failed';
        }
        this.isLoading = false;
      }
    });
  }
}
