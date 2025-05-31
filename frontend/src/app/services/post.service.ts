import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 👍 "Me gusta" (LIKE)
  toggleLike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, {}, { headers });
  }

  hasUserLiked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/like/${userId}`);
  }

  // 👎 "No me gusta" (DISLIKE)
  toggleDislike(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/dislike`, {}, { headers });
  }

  hasUserDisliked(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/dislike/${userId}`);
  }

  // ⭐ Favoritos
  addToFavorites(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/favorites`, {}, { headers });
  }

  hasUserFavorited(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/favorites/check`, { headers });
  }

  // 🚩 Reportar
  reportPost(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/report`, {}, { headers });
  }

  hasUserReported(postId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(`${this.apiUrl}/${postId}/report/check`, { headers });
  }

  // 💬 Respuestas (Replies)
  createReply(replyData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${environment.apiUrl}/replies`, replyData, { headers });
  }

  getRepliesByPost(postId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/replies/post/${postId}`);
  }

  // 📄 Posts (creación, detalle, filtrado)
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, postData, { headers });
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`);
  }

  getPaginatedPosts(category: string, page: number, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}/paginated?page=${page}&size=${size}`);
  }

  getTopPostsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/top?category=${category}`);
  }

  getRandomPostsByCategory(category: string, limit: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category}/random?limit=${limit}`);
  }

  getRecentPosts(limit: number = 4): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recentes?limit=${limit}`);
  }

  // 🔁 Alternar favoritos y reportes
  toggleFavorito(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/favorites`, {}, { headers });
  }

  toggleReport(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${postId}/report`, {}, { headers });
  }
}
