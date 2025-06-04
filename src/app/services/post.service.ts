import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // 📌 URL base para los endpoints relacionados con posts
  private apiUrl = `${environment.apiUrl}/posts`;

  // 📌 URL base para los endpoints relacionados con respuestas (replies)
  private repliesUrl = `${environment.apiUrl}/replies`;

  constructor(private http: HttpClient) {}

  /**
   * 🔐 Genera cabeceras HTTP con el token JWT para endpoints protegidos
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ============================================================================
  // 👍 ME GUSTA (LIKE)
  // ============================================================================

  /**
   * ✅ Alterna el estado de "me gusta" en un post
   */
  toggleLike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya ha dado "me gusta" a un post
   */
  hasUserLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/like/${userId}`);
  }

  // ============================================================================
  // 👎 NO ME GUSTA (DISLIKE)
  // ============================================================================

  /**
   * ✅ Alterna el estado de "no me gusta" en un post
   */
  toggleDislike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/dislike`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya ha dado "no me gusta" a un post
   */
  hasUserDisliked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/dislike/${userId}`);
  }

  // ============================================================================
  // ⭐ FAVORITOS
  // ============================================================================

  /**
   * ✅ Añade o elimina un post de favoritos
   */
  toggleFavorito(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/favorites`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el post está marcado como favorito por el usuario
   */
  hasUserFavorited(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/favorites/check`, { headers });
  }

  // ============================================================================
  // 🚩 REPORTES
  // ============================================================================

  /**
   * ✅ Reporta un post (una sola vez por usuario)
   */
  toggleReport(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/report`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya reportó ese post
   */
  hasUserReported(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/report/check`, { headers });
  }

  // ============================================================================
  // 💬 RESPUESTAS (REPLIES)
  // ============================================================================

  /**
   * ✅ Crea una nueva respuesta a un post (requiere login)
   */
  createReply(replyData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.repliesUrl}`, replyData, { headers });
  }

  /**
   * 🔍 Obtiene todas las respuestas asociadas a un post
   */
  getRepliesByPost(postId: number): Observable<any> {
    return this.http.get(`${this.repliesUrl}/post/${postId}`);
  }

  // ============================================================================
  // 📄 GESTIÓN DE POSTS
  // ============================================================================

  /**
   * ✅ Crea un nuevo post con formulario multipart (imagen, texto, etc.)
   */
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, postData, { headers });
  }

  /**
   * 🔍 Obtiene un post por su ID
   */
  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }

  /**
   * 🔍 Posts paginados por categoría
   */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /**
   * 🔍 Posts más votados de una categoría
   */
  getTopPostsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/top?category=${category}`);
  }

  /**
   * 🔀 Posts aleatorios de una categoría
   */
  getRandomPostsByCategory(category: string, limit: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}/random?limit=${limit}`);
  }

  /**
   * 🕓 Posts más recientes
   */
  getRecentPosts(limit: number = 4): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recentes?limit=${limit}`);
  }
}
