import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
      <div class="card shadow-lg border-0" style="width: 500px; border-radius: 15px;">
        <div class="card-header text-center bg-success text-white">
          <h3 class="mb-0 py-3">
            <i class="bi bi-person-plus-fill me-2"></i>
            Create Account
          </h3>
        </div>
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <h5 class="text-muted">Join Our Platform!</h5>
            <p class="text-muted small">Create your account to get started</p>
          </div>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-person me-2"></i>Username
                </label>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  formControlName="userName"
                  placeholder="Choose username"
                  [class.is-invalid]="registerForm.get('userName')?.invalid && registerForm.get('userName')?.touched"
                >
                <div class="invalid-feedback" *ngIf="registerForm.get('userName')?.invalid && registerForm.get('userName')?.touched">
                  Username is required
                </div>
              </div>
            
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-envelope me-2"></i>Email
                </label>
                <input 
                  type="email" 
                  class="form-control form-control-lg" 
                  formControlName="email"
                  placeholder="Enter email address"
                  [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                >
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  Valid email is required
                </div>
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
                placeholder="Create strong password"
                [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              >
              <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                Password is required (minimum 6 characters)
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-person-badge me-2"></i>Role
              </label>
              <select 
                class="form-select form-select-lg" 
                formControlName="role"
                [class.is-invalid]="registerForm.get('role')?.invalid && registerForm.get('role')?.touched"
              >
                <option value="">Select Role</option>
                <option value="Student">🎓 Student</option>
                <option value="Admin">👨‍💼 Administrator</option>
              </select>
              <div class="invalid-feedback" *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
                Role is required
              </div>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-success btn-lg w-100 mb-3"
              [disabled]="registerForm.invalid || loading"
              style="border-radius: 10px;"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-person-plus me-2" *ngIf="!loading"></i>
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
            
            <div class="text-center mt-4">
              <p class="mb-0">Already have an account?</p>
              <a routerLink="/login" class="btn btn-outline-primary btn-sm mt-2">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Already have an account? Login here
              </a>
            </div>
          </form>
          
          <div *ngIf="error" class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
    
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          localStorage.setItem('registrationSuccess', 'Registration successful! Welcome to the platform.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}