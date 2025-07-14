import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Question, QuestionCreateDto } from '../models/exam.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private apiService: ApiService) {}

  getAllQuestions(examId?: number): Observable<Question[]> {
    const url = examId ? `/Questions?examId=${examId}` : '/Questions';
    return this.apiService.get<Question[]>(url);
  }

  getQuestionById(id: number, examId: number): Observable<Question> {
    return this.apiService.get<Question>(`/Questions/${id}?examId=${examId}`);
  }

  createQuestion(examId: number, question: QuestionCreateDto): Observable<Question> {
    return this.apiService.post<Question>(`/Questions?examId=${examId}`, question);
  }

  updateQuestion(id: number, examId: number, question: QuestionCreateDto): Observable<Question> {
    return this.apiService.put<Question>(`/Questions/${id}?examId=${examId}`, question);
  }

  deleteQuestion(id: number, examId: number): Observable<void> {
    return this.apiService.delete<void>(`/Questions/${id}?examId=${examId}`);
  }
}
