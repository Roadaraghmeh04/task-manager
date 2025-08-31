import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7091/api/User/tasks';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt'); // 👈 نفس الاسم اللي خزّناه بالـ AuthService
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  // Get all tasks for current user
  getTasks(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Add task for current user
  addTask(task: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = {
      Title: task.title,
      Description: task.description,
      DueDate: task.dueDate,
      Priority: task.priority,
      Status: task.status,
      CategoryName: task.category
    };
    return this.http.post<any>(this.apiUrl, payload, { headers });
  }

  // Update task
  updateTask(id: number, task: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = {
      Title: task.title,
      Description: task.description,
      DueDate: task.dueDate,
      Priority: task.priority,
      Status: task.status,
      CategoryName: task.category
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, { headers });
  }

  // Delete task
  deleteTask(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
