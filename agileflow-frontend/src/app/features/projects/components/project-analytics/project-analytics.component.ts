import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AnalyticsService } from '../../services/analytics.service';
import { 
  ProjectSummaryReport, 
  IssueStatusBreakdown, 
  IssuePriorityBreakdown, 
  SprintVelocity, 
  WorklogSummary 
} from '../../models/analytics.model';

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.css'
})
export class ProjectAnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private route = inject(ActivatedRoute);

  projectId!: number;
  
  summaryReport?: ProjectSummaryReport;
  statusBreakdown: IssueStatusBreakdown[] = [];
  priorityBreakdown: IssuePriorityBreakdown[] = [];
  sprintVelocity: SprintVelocity[] = [];
  worklogSummary: WorklogSummary[] = [];

  isLoading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = +id;
      this.loadAnalytics();
    } else {
      this.error = 'Project ID is missing.';
      this.isLoading = false;
    }
  }

  loadAnalytics(): void {
    this.isLoading = true;
    
    forkJoin({
      summary: this.analyticsService.getProjectSummaryReport(this.projectId),
      status: this.analyticsService.getIssuesByStatus(this.projectId),
      priority: this.analyticsService.getIssuesByPriority(this.projectId),
      velocity: this.analyticsService.getSprintVelocity(this.projectId),
      worklogs: this.analyticsService.getWorklogSummary(this.projectId)
    }).subscribe({
      next: (results) => {
        if (results.summary.success && results.summary.data) {
          this.summaryReport = results.summary.data;
        }
        if (results.status.success && results.status.data) {
          this.statusBreakdown = results.status.data;
        }
        if (results.priority.success && results.priority.data) {
          this.priorityBreakdown = results.priority.data;
        }
        if (results.velocity.success && results.velocity.data) {
          this.sprintVelocity = results.velocity.data;
        }
        if (results.worklogs.success && results.worklogs.data) {
          this.worklogSummary = results.worklogs.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load analytics data.';
        this.isLoading = false;
      }
    });
  }

  getPriorityClass(priority: string): string {
    const p = priority.toLowerCase();
    if (p === 'highest' || p === 'high') return 'danger';
    if (p === 'medium') return 'warning';
    return 'info';
  }
}
