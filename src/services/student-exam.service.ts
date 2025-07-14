import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { StudentExams, SubmitExamDto } from '../models/exam.models';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {
  constructor(private apiService: ApiService) {}

  submitExam(examData: SubmitExamDto): Observable<any> {
    return this.apiService.post<any>('/StudentExams/submit', examData);
  }

  getStudentExams(studentId: string): Observable<StudentExams[]> {
    return this.apiService.get<StudentExams[]>(`/StudentExams/${studentId}`);
  }
}