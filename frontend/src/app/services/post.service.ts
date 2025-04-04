import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  /** 📌 Obtener headers con token de autenticación */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /** 👍 Alternar like a un post */
  toggleLike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('🔐 Headers enviados:', headers);
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  /** 📌 Obtiene los posts paginados de una categoría */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /** ⭐ Obtiene los posts más valorados por categoría */
  getTopPostsByCategory(category: string): Observable<any> {
    const url = `${this.apiUrl}/category/top?category=${category}`;
    console.log("📌 Corrigiendo URL de la petición:", url);
    return this.http.get(url);
  }

  /** 📝 Crear un nuevo post con imágenes */
  createPost(postData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  /** 🔍 Obtener un post por su ID */
  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }
}
