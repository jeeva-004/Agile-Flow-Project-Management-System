import { Component, ElementRef, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './analytics-dashboard.html',
  styleUrls: ['./analytics-dashboard.scss']
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly projectService = inject(ProjectService);

  projectId!: number;
  projectName: string = '';
  reportData: any = null;
  loading = true;

  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityChart') priorityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('velocityChart') velocityChartRef!: ElementRef<HTMLCanvasElement>;

  private statusChart: Chart | null = null;
  private priorityChart: Chart | null = null;
  private velocityChart: Chart | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.projectId = Number(idParam);
      this.loadProjectData();
    }
  }

  loadProjectData(): void {
    this.loading = true;
    forkJoin({
      project: this.projectService.findById(this.projectId),
      status: this.analyticsService.getIssuesByStatus(this.projectId),
      priority: this.analyticsService.getIssuesByPriority(this.projectId),
      velocity: this.analyticsService.getSprintVelocity(this.projectId),
      report: this.analyticsService.getProjectSummaryReport(this.projectId)
    }).subscribe({
      next: (res: any) => {
        this.projectName = res.project.data?.name ?? 'Project';
        this.reportData = res.report.data;
        this.loading = false;

        // Wait for rendering then build charts
        setTimeout(() => {
          this.buildStatusChart(res.status.data ?? []);
          this.buildPriorityChart(res.priority.data ?? []);
          this.buildVelocityChart(res.velocity.data ?? []);
        }, 0);
      },
      error: (err) => {
        console.error('Error loading analytics data', err);
        this.loading = false;
      }
    });
  }

  private buildStatusChart(data: any[]): void {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const labels = data.map(item => item.status);
    const counts = data.map(item => item.count);

    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            '#4c9aff', // Blue / INFO
            '#ff991f', // Orange / WARNING
            '#00875a'  // Green / SUCCESS
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private buildPriorityChart(data: any[]): void {
    const ctx = this.priorityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.priorityChart) {
      this.priorityChart.destroy();
    }

    const labels = data.map(item => item.priority);
    const counts = data.map(item => item.count);

    this.priorityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Issues Count',
          data: counts,
          backgroundColor: '#4c9aff',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private buildVelocityChart(data: any[]): void {
    const ctx = this.velocityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.velocityChart) {
      this.velocityChart.destroy();
    }

    const labels = data.map(item => item.sprintName);
    const planned = data.map(item => item.plannedIssueCount);
    const completed = data.map(item => item.completedIssueCount);

    this.velocityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Planned Issues',
            data: planned,
            borderColor: '#4c9aff',
            backgroundColor: 'rgba(76, 154, 255, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Completed Issues',
            data: completed,
            borderColor: '#00875a',
            backgroundColor: 'rgba(0, 135, 90, 0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.statusChart) {
      this.statusChart.destroy();
    }
    if (this.priorityChart) {
      this.priorityChart.destroy();
    }
    if (this.velocityChart) {
      this.velocityChart.destroy();
    }
  }
}
