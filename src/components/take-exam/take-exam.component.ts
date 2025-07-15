import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { StudentExamService } from '../../services/student-exam.service';
import { AuthService } from '../../services/auth.service';
import { Exam, SubmitExamDto, SubmitAnswerDto } from '../../models/exam.models';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container" *ngIf="exam">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="mb-0">{{ exam.title }}</h4>
              <div class="badge bg-primary fs-6">
                Time Remaining: {{ formatTime(timeRemaining) }}
              </div>
            </div>
            <div class="card-body">
              <p class="text-muted mb-4">{{ exam.description }}</p>
              
              <form [formGroup]="examForm" (ngSubmit)="submitExam()">
                <div class="mb-4" *ngFor="let question of exam.questions; let i = index">
                  <div class="card">
                    <div class="card-header">
                      <h6 class="mb-0">Question {{ i + 1 }}</h6>
                    </div>
                    <div class="card-body">
                      <p class="mb-3">{{ question.text }}</p>
                      <div class="form-check mb-2" *ngFor="let answer of question.answers">
                        <input 
                          class="form-check-input" 
                          type="radio" 
                          [name]="'question_' + question.id"
                          [value]="answer.id"
                          [formControlName]="'question_' + question.id"
                          [id]="'answer_' + answer.id"
                        >
                        <label class="form-check-label" [for]="'answer_' + answer.id">
                          {{ answer.text }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    <i class="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="submitting">
                    <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-check-circle me-2"></i>
                    Submit Exam
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Exam Information</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <strong>Duration:</strong> {{ exam.duration }} minutes
              </div>
              <div class="mb-3">
                <strong>Questions:</strong> {{ exam.questions?.length || 0 }}
              </div>
              <div class="mb-3">
                <strong>Status:</strong> 
                <span class="badge bg-warning">In Progress</span>
              </div>
              <div class="progress mb-3">
                <div 
                  class="progress-bar" 
                  [style.width.%]="getProgress()"
                  role="progressbar"
                >
                  {{ getProgress() }}%
                </div>
              </div>
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Make sure to answer all questions before submitting.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TakeExamComponent implements OnInit {
  exam: Exam | null = null;
  examForm: FormGroup;
  timeRemaining = 0;
  timer: any;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private examService: ExamService,
    private studentExamService: StudentExamService,
    private authService: AuthService
  ) {
    this.examForm = this.fb.group({});
  }

  ngOnInit(): void {
    const examId = this.route.snapshot.params['id'];
    this.loadExam(examId);
  }

  loadExam(examId: number): void {
    this.examService.getExamById(examId).subscribe({
      next: (exam) => {
        console.log('Exam loaded:', exam); // ← Check this!
        this.exam = exam;
        this.timeRemaining = exam.duration * 60;
        this.setupForm();
        this.startTimer();
      },
      error: (err) => console.error('Error loading exam:', err)
    });
  }

  setupForm(): void {
    if (this.exam?.questions) {
      const formControls: { [key: string]: any } = {};
      this.exam.questions.forEach(question => {
        formControls[`question_${question.id}`] = [''];
      });
      this.examForm = this.fb.group(formControls);
    }
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgress(): number {
    if (!this.exam?.questions) return 0;
    
    const totalQuestions = this.exam.questions.length;
    let answeredQuestions = 0;
    
    this.exam.questions.forEach(question => {
      const answer = this.examForm.get(`question_${question.id}`)?.value;
      if (answer) {
        answeredQuestions++;
      }
    });
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  submitExam(): void {
    if (this.submitting) return;
    
    this.submitting = true;
    clearInterval(this.timer);
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.exam) return;

    const answers: SubmitAnswerDto[] = [];
    
    if (this.exam.questions) {
      this.exam.questions.forEach(question => {
        const selectedAnswerId = this.examForm.get(`question_${question.id}`)?.value;
        if (selectedAnswerId) {
          answers.push({
            questionId: question.id,
            answerId: parseInt(selectedAnswerId)
          });
        }
      });
    }

    const submitData: SubmitExamDto = {
      examId: this.exam.id,
      studentId: currentUser.id,
      answers: answers
    };

    this.studentExamService.submitExam(submitData).subscribe({
      next: () => {
        alert('Exam submitted successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error submitting exam:', err);
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
      clearInterval(this.timer);
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}