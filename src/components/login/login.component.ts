import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="card shadow-lg border-0" style="width: 450px; border-radius: 15px;">
        <div class="card-header text-center bg-primary text-white">
          <h3 class="mb-0 py-3">
            <i class="bi bi-mortarboard-fill me-2"></i>
            Examination System
          </h3>
        </div>
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <h5 class="text-muted">Welcome Back!</h5>
            <p class="text-muted small">Please sign in to your account</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-person me-2"></i>Username
              </label>
              <input 
                type="text" 
                class="form-control form-control-lg" 
                formControlName="userName"
                placeholder="Enter your username"
                [class.is-invalid]="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched"
              >
              <div class="invalid-feedback" *ngIf="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched">
                Username is required
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-lock me-2"></i>Password
              </label>
              <input 
                type="password" 
                class="form-control form-control-lg" 
                formControlName="password"
                placeholder="Enter your password"
                [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              >
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary btn-lg w-100 mb-3"
              [disabled]="loginForm.invalid || loading"
              style="border-radius: 10px;"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-box-arrow-in-right me-2" *ngIf="!loading"></i>
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
            
            <div class="text-center mt-4">
              <p class="mb-0">Don't have an account?</p>
              <a routerLink="/register" class="btn btn-outline-success btn-sm mt-2">
                <i class="bi bi-person-plus me-2"></i>
                Don't have an account? Register here
              </a>
            </div>
          </form>
          
          <div *ngIf="error" class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success mt-3">
            <i class="bi bi-check-circle me-2"></i>
            {{ successMessage }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  successMessage = '';
  private returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    // Check for success message from registration
    const message = localStorage.getItem('registrationSuccess');
    if (message) {
      this.successMessage = message;
      localStorage.removeItem('registrationSuccess');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Navigate to the intended page or dashboard
          const redirectUrl = localStorage.getItem('redirectUrl') || this.returnUrl;
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
    }
  }
}