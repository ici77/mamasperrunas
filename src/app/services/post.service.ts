import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para gestionar las publicaciones (posts) en la aplicación.
 * Proporciona métodos para crear, obtener, interactuar (me gusta, no me gusta, reportes, favoritos) 
 * y gestionar las respuestas de los posts.
 * 
 * @service
 * @example
 * postService.createPost(formData);
 * postService.toggleLike(1);
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {

  /** URL base para los endpoints relacionados con posts */
  private apiUrl = `${environment.apiUrl}/posts`;

  /** URL base para los endpoints relacionados con respuestas (replies) */
  private repliesUrl = `${environment.apiUrl}/replies`;

  /**
   * Constructor para inicializar el servicio de posts.
   * 
   * @param http - Servicio HTTP para hacer las peticiones a la API
   */
  constructor(private http: HttpClient) {}

  /**
   * 🔐 Genera cabeceras HTTP con el token JWT para endpoints protegidos
   * 
   * @returns Cabeceras HTTP con el token de autenticación
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
   * ✅ Alterna el estado de "me gusta" en un post.
   * 
   * @param postId - ID del post
   * @returns Observable con la respuesta de la API
   */
  toggleLike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya ha dado "me gusta" a un post.
   * 
   * @param postId - ID del post
   * @param userId - ID del usuario
   * @returns Observable con el estado del "me gusta"
   */
  hasUserLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/like/${userId}`);
  }

  // ============================================================================ 
  // 👎 NO ME GUSTA (DISLIKE)
  // ============================================================================

  /**
   * ✅ Alterna el estado de "no me gusta" en un post.
   * 
   * @param postId - ID del post
   * @returns Observable con la respuesta de la API
   */
  toggleDislike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/dislike`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya ha dado "no me gusta" a un post.
   * 
   * @param postId - ID del post
   * @param userId - ID del usuario
   * @returns Observable con el estado del "no me gusta"
   */
  hasUserDisliked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/dislike/${userId}`);
  }

  // ============================================================================ 
  // ⭐ FAVORITOS
  // ============================================================================

  /**
   * ✅ Añade o elimina un post de favoritos.
   * 
   * @param postId - ID del post
   * @returns Observable con la respuesta de la API
   */
  toggleFavorito(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/favorites`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el post está marcado como favorito por el usuario.
   * 
   * @param postId - ID del post
   * @returns Observable con el estado de favorito
   */
  hasUserFavorited(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/favorites/check`, { headers });
  }

  // ============================================================================ 
  // 🚩 REPORTES
  // ============================================================================

  /**
   * ✅ Reporta un post (una sola vez por usuario).
   * 
   * @param postId - ID del post
   * @returns Observable con la respuesta de la API
   */
  toggleReport(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/report`, {}, { headers });
  }

  /**
   * 🔍 Verifica si el usuario ya reportó ese post.
   * 
   * @param postId - ID del post
   * @returns Observable con el estado del reporte
   */
  hasUserReported(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/report/check`, { headers });
  }

  // ============================================================================ 
  // 💬 RESPUESTAS (REPLIES)
  // ============================================================================

  /**
   * ✅ Crea una nueva respuesta a un post (requiere login).
   * 
   * @param replyData - Datos de la respuesta (contenido, ID del post, etc.)
   * @returns Observable con la respuesta de la API
   */
  createReply(replyData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.repliesUrl}`, replyData, { headers });
  }

  /**
   * 🔍 Obtiene todas las respuestas asociadas a un post.
   * 
   * @param postId - ID del post
   * @returns Observable con las respuestas del post
   */
  getRepliesByPost(postId: number): Observable<any> {
    return this.http.get(`${this.repliesUrl}/post/${postId}`);
  }

  // ============================================================================ 
  // 📄 GESTIÓN DE POSTS
  // ============================================================================

  /**
   * ✅ Crea un nuevo post con formulario multipart (imagen, texto, etc.).
   * 
   * @param postData - Datos del post en formato `FormData`
   * @returns Observable con la respuesta de la API
   */
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, postData, { headers });
  }

  /**
   * 🔍 Obtiene un post por su ID.
   * 
   * @param postId - ID del post
   * @returns Observable con los detalles del post
   */
  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }

  /**
   * 🔍 Obtiene posts paginados por categoría.
   * 
   * @param category - Categoría de los posts
   * @param page - Página actual
   * @param size - Número de elementos por página
   * @returns Observable con los posts paginados
   */
  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  /**
   * 🔍 Obtiene los posts más votados de una categoría.
   * 
   * @param category - Categoría de los posts
   * @returns Observable con los posts más votados
   */
  getTopPostsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/top?category=${category}`);
  }

  /**
   * 🔀 Obtiene posts aleatorios de una categoría.
   * 
   * @param category - Categoría de los posts
   * @param limit - Número máximo de posts a obtener
   * @returns Observable con los posts aleatorios
   */
  getRandomPostsByCategory(category: string, limit: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}/random?limit=${limit}`);
  }

  /**
   * 🕓 Obtiene los posts más recientes.
   * 
   * @param limit - Número máximo de posts a obtener
   * @returns Observable con los posts más recientes
   */
  getRecentPosts(limit: number = 4): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recentes?limit=${limit}`);
  }
}
