import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard/admin']);
    } else if (role === 'PROJECT_MANAGER') {
      this.router.navigate(['/dashboard/pm']);
    } else {
      this.router.navigate(['/dashboard/developer']);
    }
  }
}
