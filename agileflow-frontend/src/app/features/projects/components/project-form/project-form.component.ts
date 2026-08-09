import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../../users/services/user.service';
import { UserResponse } from '../../../users/models/user.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectForm!: FormGroup;
  isEditMode = false;
  projectId?: number;
  isLoading = false;
  error = '';
  
  users: UserResponse[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.projectId = +idParam;
    }

    this.initForm();
    this.loadUsers(); // For owner selection dropdown

    if (this.isEditMode) {
      this.loadProject();
    }
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      ownerId: [null, Validators.required]
    });
  }

  private loadUsers(): void {
    // Fetch users to populate the owner dropdown. Usually we'd want only admins/PMs,
    // but for now we fetch the first page of users or an endpoint that returns potential owners.
    this.userService.getUsers(0, 100).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Filter out users who are not PMs or Admins if necessary
          this.users = res.data.content;
        }
      }
    });
  }

  private loadProject(): void {
    if (!this.projectId) return;
    this.isLoading = true;
    this.projectService.getProject(this.projectId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.projectForm.patchValue({
            name: res.data.name,
            description: res.data.description,
            startDate: res.data.startDate,
            endDate: res.data.endDate,
            ownerId: res.data.ownerId
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load project';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.isLoading = true;
    const formValue = this.projectForm.value;

    const request = this.isEditMode ? 
      this.projectService.updateProject(this.projectId!, formValue) : 
      this.projectService.createProject(formValue);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/projects']);
        } else {
          this.error = res.message || 'Operation failed';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Operation failed';
        this.isLoading = false;
      }
    });
  }
}
