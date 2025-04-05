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

  /** ✅ Alternar "No me gusta" */
  toggleDislike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/dislike`, {}, { headers });
  }
  
/** 🔍 Saber si el usuario ya dio "No me gusta" */
hasUserDisliked(postId: number, userId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/${postId}/dislike/${userId}`);
}
/**crear respuestas solo usuarios logados */
createReply(replyData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post('http://localhost:8080/api/replies', replyData, { headers });
}
/** 📌 Obtiene las respuestas de un post */

getRepliesByPost(postId: number): Observable<any> {
  return this.http.get(`http://localhost:8080/api/replies/post/${postId}`);
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

 /** 📝 Crear un nuevo post con imágenes (requiere login) */
createPost(postData: FormData): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(this.apiUrl, postData, { headers });
}
getRandomPostsByCategory(category: string, limit: number = 6): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/category/${category}/random?limit=${limit}`);
}


  /** 🔍 Obtener un post por su ID */
  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }

  getRecentPosts(limit: number = 4) {
    return this.http.get<any[]>(`http://localhost:8080/api/posts/recentes?limit=${limit}`);
  }
  
}
