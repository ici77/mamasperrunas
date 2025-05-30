import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  /** ✅ Genera cabeceras con el token JWT para endpoints protegidos */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // -------------------------------------------------------------------
  // 👍 "Me gusta" (LIKE)
  // -------------------------------------------------------------------

  /** ✅ Alterna el estado de like (me gusta) */
  toggleLike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  /** ✅ Verifica si el usuario ya dio "me gusta" a un post (usando userId explícito, puedes eliminarlo si ya no lo usas) */
  hasUserLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/like/${userId}`);
  }

  // -------------------------------------------------------------------
  // 👎 "No me gusta" (DISLIKE)
  // -------------------------------------------------------------------

  /** ✅ Alterna el estado de dislike (no me gusta) */
  toggleDislike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/dislike`, {}, { headers });
  }

  /** ✅ Verifica si el usuario ya dio "no me gusta" */
  hasUserDisliked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/dislike/${userId}`);
  }

  // -------------------------------------------------------------------
  // ⭐ Favoritos
  // -------------------------------------------------------------------

  /** ✅ Añade un post a favoritos (solo si no está ya marcado) */
  addToFavorites(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/favorites`, {}, { headers });
  }

  /** ✅ Verifica si el post ya está en favoritos */
  hasUserFavorited(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/favorites/check`, { headers });
  }
  

  // -------------------------------------------------------------------
  // 🚩 Reportar
  // -------------------------------------------------------------------

  /** ✅ Denuncia un post (solo una vez por usuario) */
  reportPost(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/report`, {}, { headers });
  }

  /** ✅ Verifica si el post ya fue reportado por el usuario */
  hasUserReported(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/report/check`, { headers });
  }

  // -------------------------------------------------------------------
  // 💬 Respuestas (Replies)
  // -------------------------------------------------------------------

  /** ✅ Crear una respuesta (requiere login) */
  createReply(replyData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post('http://localhost:8080/api/replies', replyData, { headers });
  }

  /** ✅ Obtener respuestas de un post */
  getRepliesByPost(postId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/replies/post/${postId}`);
  }

  // -------------------------------------------------------------------
  // 📄 Posts (creación, detalle, filtrado)
  // -------------------------------------------------------------------

  /** ✅ Crear post (multipart/form-data) con login */
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, postData, { headers });
  }

  /** ✅ Obtener un post por su ID */
  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }

  /** ✅ Obtener posts paginados por categoría */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /** ✅ Obtener los más votados de una categoría */
  getTopPostsByCategory(category: string): Observable<any> {
    const url = `${this.apiUrl}/category/top?category=${category}`;
    return this.http.get(url);
  }

  /** ✅ Obtener posts aleatorios de una categoría */
  getRandomPostsByCategory(category: string, limit: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}/random?limit=${limit}`);
  }

  /** ✅ Obtener los más recientes (si implementado en backend) */
  getRecentPosts(limit: number = 4): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/posts/recentes?limit=${limit}`);
  }
  
toggleFavorito(postId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${postId}/favorites`, {});
}

toggleReport(postId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${postId}/report`, {});
}


}
