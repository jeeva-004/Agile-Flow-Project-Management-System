import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { AdminDashboardResponse, ProjectManagerDashboardResponse, DeveloperDashboardResponse } from './models/dashboard.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  role: string | null = null;
  isLoading = true;
  error = '';

  adminData: AdminDashboardResponse | null = null;
  pmData: ProjectManagerDashboardResponse | null = null;
  devData: DeveloperDashboardResponse | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      if (user) {
        this.role = user.role;
        this.loadDashboardData(user.role);
      }
    });
  }

  private loadDashboardData(role: string): void {
    this.isLoading = true;
    let roleUpper = role ? role.toUpperCase() : '';
    if (roleUpper.startsWith('ROLE_')) {
      roleUpper = roleUpper.substring(5);
    }
    
    if (roleUpper === 'ADMIN') {
      this.dashboardService.getAdminDashboard().subscribe({
        next: (res) => {
          this.adminData = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load admin dashboard';
          this.isLoading = false;
        }
      });
    } else if (roleUpper === 'PROJECT_MANAGER') {
      this.dashboardService.getPmDashboard().subscribe({
        next: (res) => {
          this.pmData = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load PM dashboard';
          this.isLoading = false;
        }
      });
    } else {
      this.dashboardService.getDeveloperDashboard().subscribe({
        next: (res) => {
          this.devData = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load developer dashboard';
          this.isLoading = false;
        }
      });
    }
  }
}
