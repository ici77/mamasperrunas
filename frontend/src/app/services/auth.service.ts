import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECTO
import { environment } from '../../environments/environment'; // ✅ CORRECTO

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

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUserDataObservable(): Observable<any | null> {
    return this.userDataSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private loadUserData(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // ✅ CAMBIADO jwt_decode → jwtDecode
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

  getUserData(): any | null {
    return this.loadUserData();
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.updateUserData();
      })
    );
  }

  private updateUserData(): void {
    const userData = this.loadUserData();
    this.userDataSubject.next(userData);
    this.isLoggedInSubject.next(!!userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }
}
