import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * 📌 Servicio `HolaMundoService`
 *
 * Este servicio proporciona una solicitud HTTP para obtener un mensaje de prueba
 * desde el backend en `http://localhost:8080/api/hola`.
 *
 * ℹ️ **Uso:** Se inyecta en componentes para consumir la API y mostrar un mensaje.
 */
@Injectable({
  providedIn: 'root', // Proporcionado globalmente
})
export class HolaMundoService {
  /**
   * 📌 URL del backend donde se obtiene el mensaje "Hola Mundo".
   */
  private apiUrl = 'http://localhost:8080/api/hola';

  /**
   * Constructor del servicio.
   * @param http - Servicio `HttpClient` para realizar peticiones HTTP al backend.
   */
  constructor(private http: HttpClient) {}

  /**
   * 📌 Método `getHolaMundo()`
   *
   * Realiza una petición HTTP GET para obtener el mensaje "Hola Mundo" desde la API.
   *
   * @returns Un `Observable<string>` con la respuesta en formato de texto.
   */
  getHolaMundo(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
