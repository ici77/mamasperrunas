import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/forum`;  // ✅ Usa la variable del entorno

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtener las categorías disponibles del foro.
   */
  getCategories(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/categories`);
  }

  /**
   * 🔹 Crear un nuevo post en el foro.
   */
  createPost(postData: { title: string; content: string; category_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData);
  }
}
