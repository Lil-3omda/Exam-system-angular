import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentExamService } from '../../services/student-exam.service';
import { AuthService } from '../../services/auth.service';
import { StudentExams } from '../../models/exam.models';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-trophy me-2"></i>
            My Exam Results
          </h2>
          <p class="text-muted mb-0">View your exam performance and scores</p>
        </div>
        <button class="btn btn-outline-secondary" (click)="goBack()">
          <i class="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white;">
            <div class="card-body py-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="opacity-75 mb-2">Total Exams</h6>
                  <h2 class="mb-0 fw-bold">{{ studentExams.length }}</h2>
                  <small class="opacity-75">Completed</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-check-circle" style="font-size: 3rem; opacity: 0.3;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%); color: white;">
            <div class="card-body py-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="opacity-75 mb-2">Average Score</h6>
                  <h2 class="mb-0 fw-bold">{{ getAverageScore() }}%</h2>
                  <small class="opacity-75">Overall performance</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-graph-up" style="font-size: 3rem; opacity: 0.3;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); color: white;">
            <div class="card-body py-4">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="opacity-75 mb-2">Highest Score</h6>
                  <h2 class="mb-0 fw-bold">{{ getHighestScore() }}%</h2>
                  <small class="opacity-75">Best performance</small>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-award" style="font-size: 3rem; opacity: 0.3;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0">
          <h5 class="mb-0 fw-semibold">
            <i class="bi bi-list-ul me-2"></i>
            Exam History
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="studentExams.length > 0; else noResults">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr class="table-light">
                    <th class="fw-semibold">
                      <i class="bi bi-file-text me-2"></i>Exam
                    </th>
                    <th class="fw-semibold">
                      <i class="bi bi-percent me-2"></i>Score
                    </th>
                    <th class="fw-semibold">
                      <i class="bi bi-award me-2"></i>Grade
                    </th>
                    <th class="fw-semibold">
                      <i class="bi bi-calendar me-2"></i>Date Taken
                    </th>
                    <th class="fw-semibold">
                      <i class="bi bi-clock me-2"></i>Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let result of studentExams">
                    <td>
                      <div class="fw-medium">{{ result.exam?.title || 'Unknown Exam' }}</div>
                      <small class="text-muted">{{ result.exam?.description || '' }}</small>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="progress me-3" style="width: 100px; height: 8px;">
                          <div 
                            class="progress-bar" 
                            [class]="getScoreClass(result.score)"
                            [style.width.%]="result.score"
                          ></div>
                        </div>
                        <span class="fw-bold" [class]="getScoreTextClass(result.score)">
                          {{ result.score }}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span class="badge fs-6 px-3 py-2" [class]="getGradeBadgeClass(result.score)">
                        {{ getGrade(result.score) }}
                      </span>
                    </td>
                    <td>
                      <div>{{ result.takenAt | date:'medium' }}</div>
                      <small class="text-muted">{{ getTimeAgo(result.takenAt) }}</small>
                    </td>
                    <td>
                      <span class="badge bg-success">
                        <i class="bi bi-check-circle me-1"></i>
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <ng-template #noResults>
            <div class="text-center py-5">
              <i class="bi bi-clipboard-x display-1 text-muted"></i>
              <h5 class="mt-3 text-muted">No exam results yet</h5>
              <p class="text-muted">Take your first exam to see your results here.</p>
              <button class="btn btn-primary" (click)="goToDashboard()">
                <i class="bi bi-pencil-square me-2"></i>
                Take an Exam
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class StudentResultsComponent implements OnInit {
  studentExams: StudentExams[] = [];
  loading = false;

  constructor(
    private studentExamService: StudentExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentResults();
  }

  loadStudentResults(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loading = true;
      this.studentExamService.getStudentExams(currentUser.id).subscribe({
        next: (results) => {
          this.studentExams = results.sort((a, b) => 
            new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
          );
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading student results:', err);
          this.loading = false;
        }
      });
    }
  }

  getAverageScore(): string {
    if (this.studentExams.length === 0) return '0.0';
    const average = this.studentExams.reduce((sum, exam) => sum + exam.score, 0) / this.studentExams.length;
    return average.toFixed(1);
  }

  getHighestScore(): string {
    if (this.studentExams.length === 0) return '0';
    const highest = Math.max(...this.studentExams.map(exam => exam.score));
    return highest.toString();
  }

  getGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getGradeBadgeClass(score: number): string {
    if (score >= 90) return 'bg-success';
    if (score >= 80) return 'bg-primary';
    if (score >= 70) return 'bg-info';
    if (score >= 60) return 'bg-warning';
    return 'bg-danger';
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-danger';
  }

  getScoreTextClass(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}