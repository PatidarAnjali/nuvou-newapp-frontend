import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth.service'; // Make sure path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Login form data:', this.formData);
    
    this.authService.login(this.formData)
      .pipe(
        tap(response => {
          console.log('Full server response:', response);
        }),
        catchError(this.handleError)
      )
      .subscribe({
        next: (res) => {
          console.log('Login success response:', res);
          if (res && res.token) {
            localStorage.setItem('token', res.token);
            console.log('Token saved to localStorage');
            
            // Also save user info if available
            if (res.user) {
              localStorage.setItem('user', JSON.stringify(res.user));
            }
            
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Login successful but no token received';
            console.error('No token in response:', res);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Login failed';
          this.isLoading = false;
        }
      });
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('HTTP Error in handleError:', error);
    let errorMsg = '';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMsg = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMsg = `Server Error: ${error.status} - ${error.statusText || ''}`; 
      
      if (error.error && error.error.message) {
        errorMsg += ` - ${error.error.message}`;
      }
      
      // Specific error handling based on status codes
      switch (error.status) {
        case 401:
          errorMsg = 'Invalid credentials. Please check your email and password.';
          break;
        case 404:
          errorMsg = 'Login endpoint not found. Check server configuration.';
          break;
        case 500:
          errorMsg = 'Server error. Please try again later.';
          break;
        case 0:
          errorMsg = 'Network error. Please check your connection.';
          break;
      }
    }
    
    return throwError(() => ({ message: errorMsg }));
  }
}