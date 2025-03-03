import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  /** 📌 Obtiene los posts paginados de una categoría */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /** 📌 Obtiene los 4 posts más votados de una categoría */
  getTopPostsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/top`);
  }
}
