import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * 📌 Interfaz que define la estructura del perfil de usuario
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

  // ✅ Ruta de API dinámica desde environment (producción o desarrollo)
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // 🔧 En local puedes usar esta ruta comentada si lo necesitas:
  // private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  // ============================================================================
  // 👤 PERFIL DE USUARIO
  // ============================================================================

  /**
   * 🔍 Obtener los datos del perfil del usuario autenticado
   */
  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil`);
  }

  /**
   * 📷 Subir una imagen de perfil al servidor
   */
  subirImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagen`, formData);
  }

  /**
   * ✏️ Actualizar los datos completos del perfil (nombre, gustos, etc.)
   */
  actualizarPerfil(perfil: PerfilUsuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, perfil);
  }

  /**
   * ✏️ Actualizar solo el nombre del usuario
   */
  actualizarNombre(nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/nombre`, { nombre });
  }

  /**
   * 🔐 Cambiar la contraseña del usuario
   */
  cambiarPassword(datos: { actual: string, nueva: string }): Observable<any> {
    // Producción:
    return this.http.put(`${this.apiUrl}/cambiar-password`, datos);

    // Desarrollo:
    // return this.http.put('http://localhost:8080/api/usuarios/cambiar-password', datos);
  }

  /**
   * ❌ Cancelar inscripción del usuario autenticado a un evento
   */
  cancelarInscripcion(eventoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventos/${eventoId}/cancelar`);
  }
}
