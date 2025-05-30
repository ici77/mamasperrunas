import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`; // URL del backend
  private tokenKey = 'auth_token'; // Clave del token en localStorage

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userDataSubject = new BehaviorSubject<any | null>(this.loadUserData());

  constructor(private http: HttpClient, private router: Router) {
    if (this.hasToken()) {
      this.updateUserData();
    }
  }

  /**
   * 📌 Verifica si hay un token en `localStorage` al cargar la app.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * 📌 Devuelve un `Observable<boolean>` que indica si el usuario está autenticado.
   */
  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * 📌 Devuelve un `Observable<any>` con los datos del usuario autenticado.
   */
  getUserDataObservable(): Observable<any | null> {
    return this.userDataSubject.asObservable();
  }

  /**
   * 📌 Obtiene el token almacenado en `localStorage`.  
   * 🔹 Lo hacemos **público** para poder usarlo en `crear-post.component.ts`
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
 
  
  /**
   * 📌 Carga los datos del usuario desde el token almacenado.
   */
  private loadUserData(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        return {
          id: decodedToken.id,  // ✅ Se agrega el ID del usuario
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
   * 📌 Devuelve los datos del usuario autenticado desde el token.
   * 🔹 Ahora obtiene el usuario **directamente del token**, en lugar de usar `userDataSubject`
   */
  getUserData(): any | null {
    return this.loadUserData(); // ✅ Cargar siempre desde el token actualizado
  }

  /**
   * 📌 Inicia sesión enviando las credenciales al backend.
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
   * 📌 Actualiza los datos del usuario autenticado y emite los cambios.
   */
  private updateUserData(): void {
    const userData = this.loadUserData();
    this.userDataSubject.next(userData);
    this.isLoggedInSubject.next(!!userData);
  }

  /**
   * 📌 Cierra sesión eliminando el token y restableciendo el estado global.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }
}
