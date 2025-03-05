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
    const token = localStorage.getItem('token'); // 📌 Asegúrate de que el token se almacena correctamente
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  /** 📌 Obtiene los posts paginados de una categoría */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /** 📌 Obtiene los 4 posts más votados de una categoría */
  getTopPostsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/top`);
  }

  /** 📌 Crea un nuevo post con imágenes */
  createPost(postData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }
  
}
