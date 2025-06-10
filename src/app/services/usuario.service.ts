import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * 📌 Interfaz que define la estructura del perfil de usuario.
 * 
 * @interface
 * @example
 * const perfil: PerfilUsuario = {
 *   nombre: 'Juan Pérez',
 *   email: 'juan.perez@example.com',
 *   fotoPerfil: 'url_imagen_perfil',
 *   gustos: 'Perros, deportes',
 *   postsCreados: [],
 *   postsLike: [],
 *   postsFavoritos: [],
 *   eventosCreados: [],
 *   eventosInscrito: [],
 *   estadisticas: {
 *     totalPosts: 5,
 *     totalLikes: 20,
 *     totalEventos: 3
 *   }
 * };
 */
export interface PerfilUsuario {
  nombre: string;
  email: string;
  fotoPerfil: string;
  gustos: string;
  postsCreados: any[];
  postsLike: any[];
  postsFavoritos: any[];
  eventosCreados: any[];
  eventosInscrito: any[];
  estadisticas: {
    totalPosts: number;
    totalLikes: number;
    totalEventos: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  /** URL base de la API de usuarios */
  private apiUrl = `${environment.apiUrl}/usuarios`;

  /** Constructor del servicio, inyecta el servicio HTTP */
  constructor(private http: HttpClient) {}

  // ============================================================================ 
  // 👤 PERFIL DE USUARIO
  // ============================================================================

  /**
   * 📌 Obtiene los datos del perfil del usuario autenticado.
   * 
   * @returns Observable con los datos del perfil del usuario
   */
  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil`);
  }

  /**
   * 📌 Subir una imagen de perfil al servidor.
   * 
   * @param formData - Los datos del formulario que incluyen la imagen
   * @returns Observable con la respuesta de la API
   */
  subirImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagen`, formData);
  }

  /**
   * 📌 Actualiza los datos completos del perfil (nombre, gustos, etc.).
   * 
   * @param perfil - El objeto con los nuevos datos del perfil
   * @returns Observable con la respuesta de la API
   */
  actualizarPerfil(perfil: PerfilUsuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, perfil);
  }

  /**
   * 📌 Actualiza solo el nombre del usuario.
   * 
   * @param nombre - El nuevo nombre del usuario
   * @returns Observable con la respuesta de la API
   */
  actualizarNombre(nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/nombre`, { nombre });
  }

  /**
   * 🔐 Cambia la contraseña del usuario.
   * 
   * @param datos - Objeto con las contraseñas actuales y nuevas
   * @returns Observable con la respuesta de la API
   */
  cambiarPassword(datos: { actual: string, nueva: string }): Observable<any> {
    // Producción:
    return this.http.put(`${this.apiUrl}/cambiar-password`, datos);

    // Desarrollo:
    // return this.http.put('http://localhost:8080/api/usuarios/cambiar-password', datos);
  }

  /**
   * ❌ Cancela la inscripción del usuario autenticado a un evento.
   * 
   * @param eventoId - ID del evento del que el usuario desea darse de baja
   * @returns Observable con la respuesta de la API
   */
  cancelarInscripcion(eventoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventos/${eventoId}/cancelar`);
  }
}
