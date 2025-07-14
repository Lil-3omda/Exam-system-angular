import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Exam, ExamCreateDto } from '../models/exam.models';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  constructor(private apiService: ApiService) {}

  getAllExams(): Observable<Exam[]> {
    return this.apiService.get<Exam[]>('/Exams');
  }

  getExamById(id: number): Observable<Exam> {
    return this.apiService.get<Exam>(`/Exams/${id}`);
  }

  createExam(exam: ExamCreateDto): Observable<Exam> {
    return this.apiService.post<Exam>('/Exams', exam);
  }

  updateExam(id: number, exam: ExamCreateDto): Observable<Exam> {
    return this.apiService.put<Exam>(`/Exams/${id}`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.apiService.delete<void>(`/Exams/${id}`);
  }
}