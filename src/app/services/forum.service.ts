import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para gestionar las interacciones con el foro.
 * Proporciona métodos para obtener categorías, crear publicaciones y otros elementos relacionados con el foro.
 * 
 * @service
 * @example
 * forumService.getCategories();
 * forumService.createPost({ title: 'Post Title', content: 'Post Content', category_id: 1 });
 */
@Injectable({
  providedIn: 'root'
})
export class ForumService {
  /** URL de la API para acceder a los foros */
  private apiUrl = `${environment.apiUrl}/forum`;

  /**
   * Constructor para inicializar el servicio de foro.
   * 
   * @param http - Servicio HTTP para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) {}

  /**
   * 📌 Obtiene las categorías del foro.
   * 
   * @returns Observable con la lista de categorías, cada una con un ID y un nombre
   */
  getCategories(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/categories`);
  }

  /**
   * 📌 Crea una nueva publicación en el foro.
   * 
   * @param postData - Datos de la publicación a crear, incluye título, contenido y ID de la categoría
   * @returns Observable con la respuesta de la API al crear la publicación
   */
  createPost(postData: { title: string; content: string; category_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, postData);
  }
}
