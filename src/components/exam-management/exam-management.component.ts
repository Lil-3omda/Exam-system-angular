import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';
import { Exam, ExamCreateDto } from '../../models/exam.models';

@Component({
  selector: 'app-exam-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Exam Management</h2>
        <button class="btn btn-primary" (click)="showCreateForm = !showCreateForm">
          <i class="bi bi-plus-circle me-2"></i>
          {{ showCreateForm ? 'Cancel' : 'Add New Exam' }}
        </button>
      </div>

      <div class="card mb-4" *ngIf="showCreateForm">
        <div class="card-header">
          <h5 class="mb-0">{{ editingExam ? 'Edit Exam' : 'Create New Exam' }}</h5>
        </div>
        <div class="card-body">
          <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  formControlName="title"
                  [class.is-invalid]="examForm.get('title')?.invalid && examForm.get('title')?.touched"
                >
                <div class="invalid-feedback" *ngIf="examForm.get('title')?.invalid && examForm.get('title')?.touched">
                  Title is required
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Duration (minutes)</label>
                <input 
                  type="number" 
                  class="form-control" 
                  formControlName="duration"
                  [class.is-invalid]="examForm.get('duration')?.invalid && examForm.get('duration')?.touched"
                >
                <div class="invalid-feedback" *ngIf="examForm.get('duration')?.invalid && examForm.get('duration')?.touched">
                  Duration is required
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea 
                class="form-control" 
                rows="3" 
                formControlName="description"
                [class.is-invalid]="examForm.get('description')?.invalid && examForm.get('description')?.touched"
              ></textarea>
              <div class="invalid-feedback" *ngIf="examForm.get('description')?.invalid && examForm.get('description')?.touched">
                Description is required
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="examForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editingExam ? 'Update' : 'Create' }} Exam
              </button>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Existing Exams</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let exam of exams">
                  <td>{{ exam.title }}</td>
                  <td>{{ exam.description }}</td>
                  <td>{{ exam.duration }} minutes</td>
                  <td>{{ exam.createdAt | date:'short' }}</td>
                  <td>
                    <button 
                      class="btn btn-sm btn-outline-primary me-2"
                      (click)="editExam(exam)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteExam(exam.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExamManagementComponent implements OnInit {
  examForm: FormGroup;
  exams: Exam[] = [];
  showCreateForm = false;
  editingExam: Exam | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private authService: AuthService
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
      },
      error: (err) => console.error('Error loading exams:', err)
    });
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      const examData: ExamCreateDto = {
        ...this.examForm.value,
        createdById: currentUser?.id || ''
      };

      const operation = this.editingExam 
        ? this.examService.updateExam(this.editingExam.id, examData)
        : this.examService.createExam(examData);

      operation.subscribe({
        next: () => {
          this.loadExams();
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error saving exam:', err);
          this.loading = false;
        }
      });
    }
  }

  editExam(exam: Exam): void {
    this.editingExam = exam;
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description,
      duration: exam.duration
    });
    this.showCreateForm = true;
  }

  deleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.loadExams();
        },
        error: (err) => console.error('Error deleting exam:', err)
      });
    }
  }

  resetForm(): void {
    this.examForm.reset();
    this.editingExam = null;
    this.showCreateForm = false;
  }
}