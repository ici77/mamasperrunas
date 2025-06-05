import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private tokenKey = 'auth_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userDataSubject = new BehaviorSubject<any | null>(this.loadUserData());

  constructor(private http: HttpClient, private router: Router) {
    if (this.hasToken()) {
      this.updateUserData();
    }
  }

  /**
   * 📌 Registrar nuevo usuario
   */
  register(usuario: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  /**
   * 📌 Verifica si hay token
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * 📌 Observable de estado de sesión
   */
  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * 📌 Observable de datos del usuario
   */
  getUserDataObservable(): Observable<any | null> {
    return this.userDataSubject.asObservable();
  }

  /**
   * 📌 Devuelve el token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * 📌 Carga datos del usuario desde el token
   */
  private loadUserData(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        return {
          id: decodedToken.id,
          nombre: decodedToken.nombre,
          foto_perfil: decodedToken.foto_perfil
        };
      } catch (error) {
        console.error('⚠ Error al decodificar el token:', error);
        this.logout();
      }
    }
    return null;
  }

  /**
   * 📌 Carga los datos actuales del usuario
   */
  getUserData(): any | null {
    return this.loadUserData();
  }

  /**
   * 📌 Inicia sesión y guarda token
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.updateUserData();
      })
    );
  }

  /**
   * 📌 Emite los datos del usuario tras login o al iniciar la app
   */
  private updateUserData(): void {
    const userData = this.loadUserData();
    this.userDataSubject.next(userData);
    this.isLoggedInSubject.next(!!userData);
  }

  /**
   * ✅ Actualiza manualmente la foto de perfil en el observable
   */
  refrescarDatosUsuario(nuevaFoto: string): void {
  const current = this.userDataSubject.value;
  if (!current) return;

  const actualizado = {
    ...current,
    foto_perfil: nuevaFoto
  };

  this.userDataSubject.next(actualizado);
}


  /**
   * 📌 Cierra sesión
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }
}
