import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


// ✅ Interfaz completa
export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  esDePago: boolean;
  imagenUrl: string;
  tipoEvento: string;
  destacado: boolean;

  // Relación con el creador del evento
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };

  // Info auxiliar (frontend)
  apuntados?: number;
  yaInscrito?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:8080/api/eventos';

  constructor(private http: HttpClient) {}

  // ✅ Obtener eventos destacados
  getDestacados(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/destacados`);
  }

  // ✅ Buscar eventos filtrados
  buscarEventos(tipo: string, pago: string, destacado: boolean): Observable<Evento[]> {
    const params = new HttpParams()
      .set('tipo', tipo || '')
      .set('pago', pago || 'todos')
      .set('destacado', destacado.toString());

    return this.http.get<Evento[]>(`${this.apiUrl}/buscar`, { params });
  }

  // ✅ Obtener número de apuntados por evento
  getConteoApuntados(): Observable<{ [eventoId: number]: number }> {
    return this.http.get<{ [eventoId: number]: number }>(`${this.apiUrl}/apuntados`);
  }

  // ✅ Apuntar al usuario al evento
  apuntarseAEvento(evento: Evento): Observable<any> {
    return this.http.post(`${this.apiUrl}/${evento.id}/apuntarse`, {});
  }

  // ✅ Verificar si el usuario ya está inscrito a un evento
  estaInscrito(eventoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${eventoId}/esta-inscrito`);
  }

  // ✅ Crear evento sin imagen (formato JSON plano)
  crearEvento(evento: Partial<Evento>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, evento);
  }

  // ✅ Crear evento CON imagen (formato multipart/form-data)
crearEventoConImagen(formData: FormData): Observable<Evento> {
  return this.http.post<Evento>(this.apiUrl, formData, {
    reportProgress: false,
    observe: 'body'
  });
}
getEventoPorId(id: number): Observable<Evento> {
  return this.http.get<Evento>(`${this.apiUrl}/${id}`);
}
getAsistentesEvento(id: number): Observable<{ resumen: string, total: number, nombres: string[] }> {
  return this.http.get<{ resumen: string, total: number, nombres: string[] }>(`${this.apiUrl}/${id}/asistentes`);
}






}
