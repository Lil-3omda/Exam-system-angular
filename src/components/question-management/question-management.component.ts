import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { AnswerService } from '../../services/answer.service';
import { ExamService } from '../../services/exam.service';
import { Question, QuestionCreateDto, Answer, AnswerCreateDto, Exam } from '../../models/exam.models';

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-question-circle me-2"></i>
            Question Management
          </h2>
          <p class="text-muted mb-0">Create and manage exam questions with multiple choice answers</p>
        </div>
        <div>
          <button class="btn btn-outline-secondary me-2" (click)="goBack()">
            <i class="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </button>
          <button class="btn btn-primary" (click)="showCreateForm = !showCreateForm">
            <i class="bi bi-plus-circle me-2"></i>
            {{ showCreateForm ? 'Cancel' : 'Add New Question' }}
          </button>
        </div>
      </div>

      <!-- Create/Edit Form -->
      <div class="card mb-4 border-0 shadow-sm" *ngIf="showCreateForm">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-plus-circle me-2"></i>
            {{ editingQuestion ? 'Edit Question' : 'Create New Question' }}
          </h5>
        </div>
        <div class="card-body">
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-list-ul me-2"></i>Select Exam
                </label>
                <select 
                  class="form-select" 
                  formControlName="examId"
                  [class.is-invalid]="questionForm.get('examId')?.invalid && questionForm.get('examId')?.touched"
                >
                  <option value="">Choose an exam...</option>
                  <option *ngFor="let exam of exams" [value]="exam.id">
                    {{ exam.title }}
                  </option>
                </select>
                <div class="invalid-feedback" *ngIf="questionForm.get('examId')?.invalid && questionForm.get('examId')?.touched">
                  Please select an exam
                </div>
              </div>
              
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">
                  <i class="bi bi-tag me-2"></i>Question Type
                </label>
                <select 
                  class="form-select" 
                  formControlName="type"
                  [class.is-invalid]="questionForm.get('type')?.invalid && questionForm.get('type')?.touched"
                >
                  <option value="">Select type...</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                </select>
                <div class="invalid-feedback" *ngIf="questionForm.get('type')?.invalid && questionForm.get('type')?.touched">
                  Question type is required
                </div>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label fw-semibold">
                <i class="bi bi-question-circle me-2"></i>Question Text
              </label>
              <textarea 
                class="form-control" 
                rows="3" 
                formControlName="text"
                placeholder="Enter your question here..."
                [class.is-invalid]="questionForm.get('text')?.invalid && questionForm.get('text')?.touched"
              ></textarea>
              <div class="invalid-feedback" *ngIf="questionForm.get('text')?.invalid && questionForm.get('text')?.touched">
                Question text is required
              </div>
            </div>

            <!-- Answers Section -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <label class="form-label fw-semibold mb-0">
                  <i class="bi bi-list-check me-2"></i>Answer Options
                </label>
                <button type="button" class="btn btn-outline-success btn-sm" (click)="addAnswer()">
                  <i class="bi bi-plus me-1"></i>Add Answer
                </button>
              </div>
              
              <div formArrayName="answers">
                <div *ngFor="let answer of answers.controls; let i = index" [formGroupName]="i" class="card mb-2">
                  <div class="card-body py-3">
                    <div class="row align-items-center">
                      <div class="col-md-8">
                        <input 
                          type="text" 
                          class="form-control" 
                          formControlName="text"
                          placeholder="Enter answer option..."
                        >
                      </div>
                      <div class="col-md-2">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            formControlName="isCorrect"
                            [id]="'correct_' + i"
                          >
                          <label class="form-check-label" [for]="'correct_' + i">
                            Correct
                          </label>
                        </div>
                      </div>
                      <div class="col-md-2">
                        <button 
                          type="button" 
                          class="btn btn-outline-danger btn-sm w-100"
                          (click)="removeAnswer(i)"
                          [disabled]="answers.length <= 2"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="alert alert-info mt-2" *ngIf="answers.length < 2">
                <i class="bi bi-info-circle me-2"></i>
                Please add at least 2 answer options.
              </div>
            </div>
            
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="questionForm.invalid || loading || answers.length < 2">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i class="bi bi-check-circle me-2" *ngIf="!loading"></i>
                {{ editingQuestion ? 'Update' : 'Create' }} Question
              </button>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">
                <i class="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Questions List -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0">
          <h5 class="mb-0 fw-semibold">
            <i class="bi bi-list-ul me-2"></i>
            Existing Questions
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="questions.length > 0; else noQuestions">
            <div class="row">
              <div class="col-12" *ngFor="let question of questions; let i = index">
                <div class="card mb-3 border-start border-primary border-4">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="flex-grow-1">
                        <h6 class="card-title mb-2">
                          <span class="badge bg-primary me-2">Q{{ i + 1 }}</span>
                          {{ question.text }}
                        </h6>
                        <div class="d-flex gap-3 mb-3">
                          <small class="text-muted">
                            <i class="bi bi-tag me-1"></i>
                            Type: {{ question.type }}
                          </small>
                          <small class="text-muted">
                            <i class="bi bi-file-text me-1"></i>
                            Exam: {{ getExamTitle(question.examId) }}
                          </small>
                        </div>
                      </div>
                      <div class="btn-group">
                        <button 
                          class="btn btn-sm btn-outline-primary"
                          (click)="editQuestion(question)"
                          title="Edit Question"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger"
                          (click)="deleteQuestion(question.id)"
                          title="Delete Question"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Answers -->
                    <div class="row">
                      <div class="col-12">
                        <h6 class="mb-2">
                          <i class="bi bi-list-check me-2"></i>
                          Answer Options:
                        </h6>
                        <div class="row">
                          <div class="col-md-6" *ngFor="let answer of question.answers; let j = index">
                            <div class="d-flex align-items-center mb-2">
                              <span class="badge me-2" [class]="answer.isCorrect ? 'bg-success' : 'bg-secondary'">
                                {{ getCharCode(j) }}
                              </span>
                              <span [class]="answer.isCorrect ? 'fw-bold text-success' : ''">
                                {{ answer.text }}
                              </span>
                              <i class="bi bi-check-circle-fill text-success ms-2" *ngIf="answer.isCorrect"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ng-template #noQuestions>
            <div class="text-center py-5">
              <i class="bi bi-question-circle display-1 text-muted"></i>
              <h5 class="mt-3 text-muted">No questions created yet</h5>
              <p class="text-muted">Create your first question to get started with building exams.</p>
              <button class="btn btn-primary" (click)="showCreateForm = true">
                <i class="bi bi-plus-circle me-2"></i>
                Create First Question
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class QuestionManagementComponent implements OnInit {
  questionForm: FormGroup;
  questions: Question[] = [];
  exams: Exam[] = [];
  showCreateForm = false;
  editingQuestion: Question | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private examService: ExamService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      examId: ['', Validators.required],
      answers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadExams();

    this.questionForm.get('examId')?.valueChanges.subscribe(examId => {
      if (examId) {
        this.loadQuestions();
      }
    });

    this.initializeAnswers();
  }


  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  initializeAnswers(): void {
    // Add default 4 answer options
    for (let i = 0; i < 4; i++) {
      this.addAnswer();
    }
  }

  addAnswer(): void {
    const answerGroup = this.fb.group({
      text: ['', Validators.required],
      isCorrect: [false]
    });
    this.answers.push(answerGroup);
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.removeAt(index);
    }
  }

  loadQuestions(): void {
    const selectedExamId = this.questionForm.get('examId')?.value;
    if (!selectedExamId) return;

    this.questionService.getAllQuestions(selectedExamId).subscribe({
      next: (questions) => {
        this.questions = questions;
      },
      error: (err) => console.error('Error loading questions:', err)
    });
  }


  loadExams(): void {
    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
      },
      error: (err) => console.error('Error loading exams:', err)
    });
  }

  getExamTitle(examId: number): string {
    const exam = this.exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  }

  onSubmit(): void {
    if (this.questionForm.valid && this.answers.length >= 2) {
      this.loading = true;
      
      const examId = this.questionForm.value.examId;

      const questionData: QuestionCreateDto = {
        text: this.questionForm.value.text,
        type: this.questionForm.value.type
      };

      const operation = this.editingQuestion
        ? this.questionService.updateQuestion(this.editingQuestion.id, examId, questionData)
        : this.questionService.createQuestion(examId, questionData);

      operation.subscribe({
        next: (question: Question) => {
          this.createAnswers(question.id);
        },
        error: (err: any) => {
          console.error('Error saving question:', err);
          this.loading = false;
        }
      });

    }
  }

  createAnswers(questionId: number): void {
    const answerPromises = this.answers.value.map((answer: any) => {
      const answerData: AnswerCreateDto = {
        text: answer.text,
        isCorrect: answer.isCorrect
      };
      return this.answerService.createAnswer(answerData).toPromise();
    });

    Promise.all(answerPromises).then(() => {
      this.loadQuestions();
      this.resetForm();
      this.loading = false;
    }).catch(err => {
      console.error('Error creating answers:', err);
      this.loading = false;
    });
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      text: question.text,
      type: question.type,
      examId: question.examId
    });
    
    // Clear existing answers and add question's answers
    while (this.answers.length !== 0) {
      this.answers.removeAt(0);
    }
    
    if (question.answers) {
      question.answers.forEach(answer => {
        const answerGroup = this.fb.group({
          text: [answer.text, Validators.required],
          isCorrect: [answer.isCorrect]
        });
        this.answers.push(answerGroup);
      });
    }
    
    this.showCreateForm = true;
  }

  deleteQuestion(questionId: number): void {
    const examId = this.questions.find(q => q.id === questionId)?.examId;
    if (!examId) {
      console.error('Exam ID not found for the question');
      return;
    }

    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      this.questionService.deleteQuestion(questionId, examId).subscribe({
        next: () => {
          this.loadQuestions();
        },
        error: (err) => console.error('Error deleting question:', err)
      });
    }
  }


  resetForm(): void {
    this.questionForm.reset();
    this.editingQuestion = null;
    this.showCreateForm = false;
    
    // Reset answers array
    while (this.answers.length !== 0) {
      this.answers.removeAt(0);
    }
    this.initializeAnswers();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getCharCode(index: number): string {
    return String.fromCharCode(65 + index);
  }
}