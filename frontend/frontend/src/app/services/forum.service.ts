import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:8080/api/forum';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/categories`);
  }

  createPost(postData: { title: string; content: string; category_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData);
  }
}
