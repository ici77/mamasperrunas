import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogApiService {
  private apiUrl = 'https://api.thedogapi.com/v1/breeds'; // API externa
  private apiKey = 'live_6IpVnEm2JnKGajVTUucJws58ErwUOSDQNKzwkMxNtJR0mhU1nlVuRdD5r4rypFoB'; // API Key

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de razas de perros directamente desde The Dog API.
   * @returns {Observable<any[]>} Observable con la lista de razas.
   */
  getDogBreeds(): Observable<any[]> {
    const headers = new HttpHeaders({
      'x-api-key': this.apiKey // Agrega la API Key en los headers
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
