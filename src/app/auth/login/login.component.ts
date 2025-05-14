import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
    CommonModule],
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
    private router: Router,
    private authService: AuthService
  ) { }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Login attempt with email:', this.formData.email);

    this.authService.login(this.formData)
      .pipe(
        tap(response => {
          console.log('Login successful, response:', response);

          if (response && response.token) {
            console.log('Token received, will navigate to user-dashboard');
          }
        }),
        catchError(this.handleError),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res && res.token) {
            // IMP! Navigate to user-dashboard instead of dashboard
            console.log('Navigating to user-dashboard...');

            // use a small timeout to ensure state updates before navigation
            setTimeout(() => {
              this.router.navigate(['/dashboard'])
                .then(success => {
                  console.log('Navigation result:', success ? 'successful' : 'failed');
                  if (!success) {
                    console.error('Navigation failed. Check your routes configuration.');
                    this.errorMessage = 'Navigation failed. Please try again.';
                  }
                })
                .catch(err => {
                  console.error('Navigation error:', err);
                  this.errorMessage = 'Error during navigation.';
                });
            }, 300);
          } else {
            this.errorMessage = 'Login successful but no token received';
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Login failed';
          this.isLoading = false;
        }
      });
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('HTTP Error:', error);
    let errorMsg = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMsg = `Client Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMsg = `Server Error: ${error.status}`;

      if (error.error && error.error.message) {
        errorMsg += ` - ${error.error.message}`;
      }

      switch (error.status) {
        case 401:
          errorMsg = 'Invalid email or password.';
          break;
        case 404:
          errorMsg = 'Login service not found.';
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