// user-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { DashboardService } from '../shared/dashboard.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: any;
  portfolios: any[] = [];
  journals: any[] = [];
  stats: any = {
    projectCount: 0,
    journalCount: 0,
    daysActive: 0,
    collaborationCount: 0
  };
  isLoading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Load dashboard data
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.portfolios = data.portfolios || [];
        this.journals = data.journals || [];
        this.stats = data.stats || this.stats;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
        console.error('Dashboard data error:', err);
      }
    });
    
    // iupdate user activity
    this.dashboardService.updateUserActivity().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  createNewProject(): void {
    // Navigate to project creation page or open modal
    this.router.navigate(['/portfolio/new']);
  }

  createNewJournalEntry(): void {
    // Navigate to journal creation page or open modal
    this.router.navigate(['/journal/new']);
  }
}