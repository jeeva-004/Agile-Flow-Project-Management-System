import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { ActivityResponse } from '../../models/activity.model';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent implements OnInit {
  private activityService = inject(ActivityService);
  private route = inject(ActivatedRoute);

  projectId!: number;
  activities: ActivityResponse[] = [];
  isLoading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = +id;
      this.loadActivities();
    } else {
      this.error = 'Project ID is missing.';
      this.isLoading = false;
    }
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getActivitiesByProject(this.projectId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.activities = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load activities.';
        this.isLoading = false;
      }
    });
  }

  getIcon(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return '✨';
    if (actionLower.includes('update')) return '✏️';
    if (actionLower.includes('delete')) return '🗑️';
    if (actionLower.includes('assign')) return '👤';
    if (actionLower.includes('status')) return '🔄';
    if (actionLower.includes('comment')) return '💬';
    return '📝';
  }
}
