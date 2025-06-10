import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaz para representar un evento en la aplicación.
 * Define las propiedades y relaciones de un evento.
 * 
 * @interface
 * @example
 * const evento: Evento = {
 *   id: 1,
 *   titulo: 'Evento de perros',
 *   descripcion: 'Descripción del evento',
 *   fecha: '2022-12-31',
 *   lugar: 'Madrid',
 *   esDePago: false,
 *   imagenUrl: 'url_de_imagen',
 *   tipoEvento: 'celebración',
 *   destacado: true,
 *   usuario: { id: 1, nombre: 'Juan', email: 'juan@example.com' },
 *   apuntados: 50,
 *   yaInscrito: false
 * };
 */
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

  // Información auxiliar (frontend)
  apuntados?: number;
  yaInscrito?: boolean;
}

/**
 * Servicio para gestionar los eventos en la aplicación.
 * Proporciona métodos para crear, buscar, obtener detalles y gestionar la inscripción de eventos.
 * 
 * @service
 * @example
 * eventService.buscarEventos('celebración', 'todos', true);
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {

  /** URL base de la API de eventos */
  private apiUrl = `${environment.apiUrl}/eventos`;

  /**
   * Constructor para inicializar el servicio de eventos.
   * 
   * @param http - Servicio HTTP para hacer peticiones a la API
   */
  constructor(private http: HttpClient) {}

  /**
   * 📌 Obtiene los eventos destacados.
   * 
   * @returns Observable con la lista de eventos destacados
   */
  getDestacados(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/destacados`);
  }

  /**
   * 📌 Busca eventos filtrados por tipo, si son de pago, y si son destacados.
   * 
   * @param tipo - Tipo de evento a filtrar
   * @param pago - Si los eventos son de pago o gratuitos
   * @param destacado - Si los eventos son destacados o no
   * @returns Observable con los eventos filtrados
   */
  buscarEventos(tipo: string, pago: string, destacado: boolean): Observable<Evento[]> {
    const params = new HttpParams()
      .set('tipo', tipo || '')
      .set('pago', pago || 'todos')
      .set('destacado', destacado.toString());

    return this.http.get<Evento[]>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * 📌 Obtiene el número de apuntados por evento.
   * 
   * @returns Observable con el conteo de apuntados por evento
   */
  getConteoApuntados(): Observable<{ [eventoId: number]: number }> {
    return this.http.get<{ [eventoId: number]: number }>(`${this.apiUrl}/apuntados`);
  }

  /**
   * 📌 Apunta al usuario al evento.
   * 
   * @param evento - Evento al que el usuario desea apuntarse
   * @returns Observable con la respuesta de la API
   */
  apuntarseAEvento(evento: Evento): Observable<any> {
    return this.http.post(`${this.apiUrl}/${evento.id}/apuntarse`, {});
  }

  /**
   * 📌 Verifica si el usuario ya está inscrito a un evento.
   * 
   * @param eventoId - ID del evento
   * @returns Observable que indica si el usuario está inscrito
   */
  estaInscrito(eventoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${eventoId}/esta-inscrito`);
  }

  /**
   * 📌 Crea un nuevo evento (sin imagen).
   * 
   * @param evento - Objeto con los datos del evento a crear
   * @returns Observable con la respuesta de la API
   */
  crearEvento(evento: Partial<Evento>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, evento);
  }

  /**
   * 📌 Crea un nuevo evento (con imagen).
   * 
   * @param formData - Datos del evento en formato `FormData` (incluye imagen)
   * @returns Observable con el evento creado
   */
  crearEventoConImagen(formData: FormData): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, formData, {
      reportProgress: false,
      observe: 'body'
    });
  }

  /**
   * 📌 Obtiene los detalles de un evento por su ID.
   * 
   * @param id - ID del evento
   * @returns Observable con los datos del evento
   */
  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  /**
   * 📌 Obtiene la lista de asistentes a un evento.
   * 
   * @param id - ID del evento
   * @returns Observable con los datos de los asistentes (resumen, total y nombres)
   */
  getAsistentesEvento(id: number): Observable<{ resumen: string, total: number, nombres: string[] }> {
    return this.http.get<{ resumen: string, total: number, nombres: string[] }>(`${this.apiUrl}/${id}/asistentes`);
  }

  /**
   * 📌 Obtiene todos los eventos sin filtros.
   * 
   * @returns Observable con la lista de todos los eventos
   */
  getTodos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }
}
