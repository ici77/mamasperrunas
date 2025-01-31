import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Proporcionado globalmente
})
export class HolaMundoService {
  private apiUrl = 'http://localhost:8080/api/hola'; // URL del backend

  constructor(private http: HttpClient) {}

  getHolaMundo(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
