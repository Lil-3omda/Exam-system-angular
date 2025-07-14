import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Answer, AnswerCreateDto } from '../models/exam.models';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(private apiService: ApiService) {}

  getAllAnswers(): Observable<Answer[]> {
    return this.apiService.get<Answer[]>('/Answers');
  }

  getAnswerById(id: number): Observable<Answer> {
    return this.apiService.get<Answer>(`/Answers/${id}`);
  }

  createAnswer(answer: AnswerCreateDto): Observable<Answer> {
    return this.apiService.post<Answer>('/Answers', answer);
  }

  updateAnswer(id: number, answer: AnswerCreateDto): Observable<Answer> {
    return this.apiService.put<Answer>(`/Answers/${id}`, answer);
  }

  deleteAnswer(id: number): Observable<void> {
    return this.apiService.delete<void>(`/Answers/${id}`);
  }
}