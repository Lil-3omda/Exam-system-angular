import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ExamService } from '../../services/exam.service';
import { StudentExamService } from '../../services/student-exam.service';
import { User } from '../../models/auth.models';
import { Exam, StudentExams } from '../../models/exam.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-vh-100" style="background-color: #f8f9fa;">
      <nav class="navbar navbar-expand-lg navbar-dark mb-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div class="container">
          <a class="navbar-brand fw-bold" href="#" style="font-size: 1.5rem;">
            <i class="bi bi-mortarboard-fill me-2"></i>
            Examination System
          </a>
          <div class="navbar-nav ms-auto d-flex align-items-center">
            <div class="dropdown me-3">
              <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-2"></i>
                {{ currentUser?.userName }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
            <span class="badge bg-light text-dark px-3 py-2 me-3">
              <i class="bi bi-shield-check me-1"></i>
              {{ isAdmin ? 'Administrator' : 'Student' }}
            </span>
          </div>
        </div>
      </nav>

      <div class="container">
        <!-- Welcome Section -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div class="card-body py-4">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <h2 class="mb-2">
                      <i class="bi bi-sun me-2"></i>
                      Good {{ getGreeting() }}, {{ currentUser?.userName }}!
                    </h2>
                    <p class="mb-0 opacity-75">
                      {{ isAdmin ? 'Manage your examination system efficiently' : 'Ready to take your next exam?' }}
                    </p>
                  </div>
                  <div class="col-md-4 text-end">
                    <div class="d-flex justify-content-end">
                      <div class="text-center me-4">
                        <div class="fs-4 fw-bold">{{ getCurrentDate() }}</div>
                        <small class="opacity-75">Today</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-4 fw-bold">{{ getCurrentTime() }}</div>
                        <small class="opacity-75">Current Time</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Sidebar Navigation -->
          <div class="col-md-3 mb-4">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h5 class="mb-0 fw-semibold">
                  <i class="bi bi-compass me-2"></i>
                  Navigation
                </h5>
              </div>
              <div class="list-group list-group-flush">
                <a 
                  *ngIf="isAdmin" 
                  class="list-group-item list-group-item-action border-0 py-3"
                  (click)="navigateTo('exams')"
                  style="cursor: pointer;"
                >
                  <i class="bi bi-file-earmark-text me-3 text-primary"></i>
                  <span class="fw-medium">Manage Exams</span>
                  <i class="bi bi-chevron-right float-end mt-1"></i>
                </a>
                <a 
                  *ngIf="isAdmin" 
                  class="list-group-item list-group-item-action border-0 py-3"
                  (click)="navigateTo('questions')"
                  style="cursor: pointer;"
                >
                  <i class="bi bi-question-circle me-3 text-success"></i>
                  <span class="fw-medium">Manage Questions</span>
                  <i class="bi bi-chevron-right float-end mt-1"></i>
                </a>
                <a 
                  *ngIf="!isAdmin" 
                  class="list-group-item list-group-item-action border-0 py-3"
                  (click)="navigateTo('take-exam')"
                  style="cursor: pointer;"
                >
                  <i class="bi bi-pencil-square me-3 text-warning"></i>
                  <span class="fw-medium">Take Exam</span>
                  <i class="bi bi-chevron-right float-end mt-1"></i>
                </a>
                <a 
                  *ngIf="!isAdmin" 
                  class="list-group-item list-group-item-action border-0 py-3"
                  (click)="navigateTo('results')"
                  style="cursor: pointer;"
                >
                  <i class="bi bi-trophy me-3 text-info"></i>
                  <span class="fw-medium">My Results</span>
                  <i class="bi bi-chevron-right float-end mt-1"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-md-9">
            <!-- Statistics Cards -->
            <div class="row">
              <div class="col-md-4 mb-4" *ngIf="isAdmin">
                <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                  <div class="card-body py-4">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="opacity-75 mb-2">Total Exams</h6>
                        <h2 class="mb-0 fw-bold">{{ totalExams }}</h2>
                        <small class="opacity-75">Active examinations</small>
                      </div>
                      <div class="align-self-center">
                        <i class="bi bi-file-earmark-text" style="font-size: 3rem; opacity: 0.3;"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-4" *ngIf="!isAdmin">
                <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white;">
                  <div class="card-body py-4">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="opacity-75 mb-2">Exams Taken</h6>
                        <h2 class="mb-0 fw-bold">{{ examsTaken }}</h2>
                        <small class="opacity-75">Completed exams</small>
                      </div>
                      <div class="align-self-center">
                        <i class="bi bi-check-circle" style="font-size: 3rem; opacity: 0.3;"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-4" *ngIf="!isAdmin">
                <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%); color: white;">
                  <div class="card-body py-4">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h6 class="opacity-75 mb-2">Average Score</h6>
                        <h2 class="mb-0 fw-bold">{{ averageScore.toFixed(1) }}%</h2>
                        <small class="opacity-75">Overall performance</small>
                      </div>
                      <div class="align-self-center">
                        <i class="bi bi-graph-up" style="font-size: 3rem; opacity: 0.3;"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Exams Table -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 fw-semibold">
                    <i class="bi bi-list-ul me-2"></i>
                  {{ isAdmin ? 'Recent Exams' : 'Available Exams' }}
                  </h5>
                  <button *ngIf="isAdmin" class="btn btn-primary btn-sm" (click)="navigateTo('exams')">
                    <i class="bi bi-plus-circle me-2"></i>
                    Add New Exam
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive" *ngIf="exams.length > 0; else noExams">
                  <table class="table table-hover align-middle">
                    <thead>
                      <tr class="table-light">
                        <th class="fw-semibold">
                          <i class="bi bi-file-text me-2"></i>Title
                        </th>
                        <th class="fw-semibold">
                          <i class="bi bi-info-circle me-2"></i>Description
                        </th>
                        <th class="fw-semibold">
                          <i class="bi bi-clock me-2"></i>Duration
                        </th>
                        <th *ngIf="isAdmin" class="fw-semibold">
                          <i class="bi bi-calendar me-2"></i>Created
                        </th>
                        <th class="fw-semibold">
                          <i class="bi bi-gear me-2"></i>Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let exam of exams">
                        <td>
                          <div class="fw-medium">{{ exam.title }}</div>
                        </td>
                        <td>
                          <div class="text-muted small" style="max-width: 200px;">
                            {{ exam.description | slice:0:50 }}{{ exam.description.length > 50 ? '...' : '' }}
                          </div>
                        </td>
                        <td>
                          <span class="badge bg-light text-dark">
                            <i class="bi bi-clock me-1"></i>
                            {{ exam.duration }} min
                          </span>
                        </td>
                        <td *ngIf="isAdmin">
                          <small class="text-muted">{{ exam.createdAt | date:'short' }}</small>
                        </td>
                        <td>
                          <div class="btn-group" role="group">
                            <button 
                              *ngIf="isAdmin" 
                              class="btn btn-sm btn-outline-primary"
                              (click)="editExam(exam.id)"
                              title="Edit Exam"
                            >
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button 
                              *ngIf="!isAdmin" 
                              class="btn btn-sm btn-success"
                              (click)="takeExam(exam.id)"
                              title="Take Exam"
                            >
                              <i class="bi bi-play-circle me-1"></i>
                              Start
                            </button>
                            <button 
                              *ngIf="isAdmin" 
                              class="btn btn-sm btn-outline-danger"
                              (click)="deleteExam(exam.id)"
                              title="Delete Exam"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <ng-template #noExams>
                  <div class="text-center py-5">
                    <i class="bi bi-inbox display-1 text-muted"></i>
                    <h5 class="mt-3 text-muted">No exams available</h5>
                    <p class="text-muted">
                      {{ isAdmin ? 'Create your first exam to get started.' : 'Check back later for new exams.' }}
                    </p>
                    <button *ngIf="isAdmin" class="btn btn-primary" (click)="navigateTo('exams')">
                      <i class="bi bi-plus-circle me-2"></i>
                      Create First Exam
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  exams: Exam[] = [];
  totalExams = 0;
  examsTaken = 0;
  averageScore = 0;
  currentTime = '';

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private studentExamService: StudentExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadDashboardData();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  loadDashboardData(): void {
    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.totalExams = exams.length;
      },
      error: (err) => console.error('Error loading exams:', err)
    });

    if (!this.isAdmin && this.currentUser) {
      this.studentExamService.getStudentExams(this.currentUser.id).subscribe({
        next: (studentExams) => {
          this.examsTaken = studentExams.length;
          if (studentExams.length > 0) {
            this.averageScore = studentExams.reduce((sum, exam) => sum + exam.score, 0) / studentExams.length;
          }
        },
        error: (err) => console.error('Error loading student exams:', err)
      });
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getCurrentTime(): string {
    return this.currentTime;
  }

  private updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  takeExam(examId: number): void {
    this.router.navigate(['/take-exam', examId]);
  }

  editExam(examId: number): void {
    this.router.navigate(['/exams/edit', examId]);
  }

  deleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (err) => console.error('Error deleting exam:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}