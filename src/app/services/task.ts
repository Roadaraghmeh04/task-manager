import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7091/api/User/tasks';
  private categoriesUrl = 'https://localhost:7091/api/User/categories';

  public userCategories: Category[] = [];

  constructor(private http: HttpClient) {}

  // دالة تجلب headers مع التوكن
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('JWT Token not found in localStorage');
      throw new Error('User not authenticated');
    }
    console.log('JWT Token:', token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // جلب كل المهام
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Error fetching tasks:', err);
          return throwError(() => err);
        })
      );
  }

  // جلب الكاتيجوريز الخاصة بالمستخدم وتخزينها
  getUserCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          console.error('Error fetching categories:', err);
          return throwError(() => err);
        })
      );
  }

  // تحويل التاريخ إلى صيغة ISO
  private formatDate(date: string): string {
    if (!date) return new Date().toISOString();
    const d = new Date(date);
    return d.toISOString();
  }

  addTask(task: any): Observable<any> {
    const headers = this.getAuthHeaders();

    const payload = {
      Title: task.title,
      Description: task.description,
      DueDate: this.formatDate(task.dueDate),
      Priority: task.priority,
      Status: task.status,
      CategoryId: task.category // 👈 مباشرة id
    };

    console.log('Payload to API:', payload);

    return this.http.post<any>(this.apiUrl, payload, { headers })
      .pipe(
        catchError(err => {
          console.error('Error adding task:', err.error);
          return throwError(() => err);
        })
      );
  }

  updateTask(id: number, task: any): Observable<any> {
    const headers = this.getAuthHeaders();

    const payload = {
      Title: task.title,
      Description: task.description,
      DueDate: this.formatDate(task.dueDate),
      Priority: task.priority,
      Status: task.status,
      CategoryId: task.category // 👈 مباشرة id
    };

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers })
      .pipe(
        catchError(err => {
          console.error('Error updating task:', err.error);
          return throwError(() => err);
        })
      );
  }



  deleteTask(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(err => {
          console.error('Error deleting task:', err);
          return throwError(() => err);
        })
      );
  }

  // جلب الـ CategoryId من الاسم
  private getCategoryIdByName(name: string): number | undefined {
    const category = this.userCategories.find(c => c.name === name);
    return category?.id;
  }
}
