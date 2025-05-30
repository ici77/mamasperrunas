import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

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
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /** ✅ Obtener datos del perfil completo */
  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil`);
  }

  /** ✅ Subir nueva imagen de perfil (FormData) */
  subirImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagen`, formData);
  }

  /** ✅ Actualizar todo el perfil (nombre, gustos, etc.) */
  actualizarPerfil(perfil: PerfilUsuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, perfil);
  }

  /** ✅ Actualizar solo el nombre */
  actualizarNombre(nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/nombre`, { nombre });
  }

  /** ✅ Cambiar contraseña */
  cambiarPassword(datos: { actual: string; nueva: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-password`, datos);
  }

  /** ✅ Cancelar inscripción a evento */
  cancelarInscripcion(eventoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eventos/${eventoId}/cancelar`);
  }
}
