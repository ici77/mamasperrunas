import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  // ✅ Buscar eventos con filtros
  buscarEventos(tipo: string, pago: boolean, destacado: boolean): Observable<Evento[]> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('pago', pago)
      .set('destacado', destacado);

    return this.http.get<Evento[]>(`${this.apiUrl}/buscar`, { params });
  }

  // ✅ Obtener número de apuntados por evento (todos)
  getConteoApuntados(): Observable<{ [eventoId: number]: number }> {
    return this.http.get<{ [eventoId: number]: number }>(`${this.apiUrl}/apuntados`);
  }

  // ✅ Apuntarse a un evento
 apuntarseAEvento(evento: Evento): Observable<any> {
  return this.http.post(`${this.apiUrl}/${evento.id}/apuntarse`, {});
}

}
