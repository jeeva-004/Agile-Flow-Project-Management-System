import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SprintService } from '../../services/sprint.service';

@Component({
  selector: 'app-sprint-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sprint-form.component.html',
  styleUrl: './sprint-form.component.css'
})
export class SprintFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sprintService = inject(SprintService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sprintForm!: FormGroup;
  isEditMode = false;
  sprintId?: number;
  projectId!: number;
  isLoading = false;
  error = '';

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
      this.sprintId = +idParam;
    }

    this.initForm();

    if (this.isEditMode) {
      this.loadSprint();
    }
  }

  private initForm(): void {
    this.sprintForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  private loadSprint(): void {
    if (!this.sprintId) return;
    this.isLoading = true;
    this.sprintService.getSprint(this.sprintId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.sprintForm.patchValue({
            name: res.data.name,
            startDate: res.data.startDate,
            endDate: res.data.endDate
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load sprint';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.sprintForm.invalid) return;

    this.isLoading = true;
    const formValue = this.sprintForm.value;
    
    // Add projectId to the payload
    const payload = { ...formValue, projectId: this.projectId };

    const request = this.isEditMode ? 
      this.sprintService.updateSprint(this.sprintId!, payload) : 
      this.sprintService.createSprint(payload);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/projects', this.projectId, 'sprints']);
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
