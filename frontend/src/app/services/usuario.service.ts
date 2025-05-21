import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/perfil`);
  }

  subirImagen(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/imagen`, formData);
}
actualizarPerfil(perfil: PerfilUsuario): Observable<any> {
  return this.http.put(`${this.apiUrl}/perfil`, perfil);
}
actualizarNombre(nombre: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/perfil/nombre`, { nombre });
}

cambiarPassword(datos: { actual: string, nueva: string }) {
  return this.http.put('http://localhost:8080/api/usuarios/cambiar-password', datos);
}


}
