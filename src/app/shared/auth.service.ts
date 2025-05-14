// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private token: string | null = null;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage() {
    // Load authenticated state from localStorage on service initialization
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.token = token; 
      this.userSubject.next(JSON.parse(user));
    }
  }

  signup(data: { email: string; password: string; username: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap(response => {
          // Store token and user details
          this.token = response.token;
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        })
      );
  }

  logout(): void {
    // Clear user data
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }
}