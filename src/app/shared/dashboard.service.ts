// dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // gtt user's portfolios
  getPortfolios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/portfolios`);
  }

  // get user's journal entries
  getJournals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/journals`);
  }

  // get user stats
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // get all dashboard data in one call
  getDashboardData(): Observable<any> {
    return forkJoin({
      portfolios: this.getPortfolios(),
      journals: this.getJournals(),
      stats: this.getUserStats()
    });
  }

  // create a new portfolio
  createPortfolio(portfolioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/portfolios`, portfolioData);
  }

  // create a new journal entry
  createJournal(journalData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/journals`, journalData);
  }

  // update user stats (like when logging in)
  updateUserActivity(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stats/activity`, {});
  }
}