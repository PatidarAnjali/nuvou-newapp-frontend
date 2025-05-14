import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/auth.service'; // Make sure path is correct

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  formData = {
    username: '',
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }

  onSignup() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Signup form data:', this.formData);

    this.authService.signup(this.formData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.isLoading = false;
        // After successful signup, you might want to:
        // 1. Either redirect to login page
        this.router.navigate(['/login']);
        // 2. Or automatically log the user in
        // this.login();
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }

  // Optional: Auto-login after signup
  private login() {
    const loginData = {
      email: this.formData.email,
      password: this.formData.password
    };
    
    this.authService.login(loginData).subscribe({
      next: (res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Auto-login failed:', err);
        // Just redirect to login if auto-login fails
        this.router.navigate(['/login']);
      }
    });
  }
}