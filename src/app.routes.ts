import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExamManagementComponent } from './components/exam-management/exam-management.component';
import { QuestionManagementComponent } from './components/question-management/question-management.component';
import { StudentResultsComponent } from './components/student-results/student-results.component';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'exams', component: ExamManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'questions', component: QuestionManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'results', component: StudentResultsComponent, canActivate: [AuthGuard] },
  { path: 'take-exam/:id', component: TakeExamComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];