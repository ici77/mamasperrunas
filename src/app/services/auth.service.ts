import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';

/**
 * Servicio para manejar la autenticación de usuarios.
 * Proporciona métodos para registrar, iniciar sesión, verificar el estado de autenticación, obtener los datos del usuario, y gestionar el cierre de sesión.
 * También maneja la persistencia del token de autenticación en `localStorage`.
 * 
 * @service
 * @example
 * authService.login({ email: 'user@example.com', password: 'password' });
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** URL de la API para usuarios */
  private apiUrl = `${environment.apiUrl}/usuarios`;

  /** Clave del token en localStorage */
  private tokenKey = 'auth_token';

  /** Sujeto que mantiene el estado de autenticación del usuario */
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  /** Sujeto que mantiene los datos del usuario autenticado */
  private userDataSubject = new BehaviorSubject<any | null>(this.loadUserData());

  /**
   * Constructor para inicializar el servicio de autenticación.
   * 
   * @param http - Servicio HTTP para hacer peticiones a la API
   * @param router - Enrutador para redirigir al usuario
   */
  constructor(private http: HttpClient, private router: Router) {
    if (this.hasToken()) {
      this.updateUserData();
    }
  }

  /**
   * 📌 Registra un nuevo usuario en la aplicación.
   * 
   * @param usuario - Objeto con los datos del usuario a registrar
   * @returns Observable con la respuesta de la API
   */
  register(usuario: { nombre: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  /**
   * 📌 Verifica si el usuario tiene un token de autenticación almacenado en `localStorage`.
   * 
   * @returns `true` si el token existe, de lo contrario `false`
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * 📌 Obtiene el estado de la autenticación del usuario.
   * 
   * @returns Observable que emite el estado de autenticación (`true` si está autenticado, `false` si no)
   */
  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * 📌 Obtiene los datos del usuario en forma de Observable.
   * 
   * @returns Observable con los datos del usuario o `null` si no está autenticado
   */
  getUserDataObservable(): Observable<any | null> {
    return this.userDataSubject.asObservable();
  }

  /**
   * 📌 Devuelve el token de autenticación almacenado en `localStorage`.
   * 
   * @returns El token de autenticación o `null` si no está presente
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * 📌 Carga los datos del usuario a partir del token de autenticación decodificado.
   * 
   * @returns Datos del usuario o `null` si no se puede cargar
   */
  private loadUserData(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        return {
          id: decodedToken.id,
          nombre: decodedToken.nombre,
          fotoPerfil: decodedToken.fotoPerfil
        };
      } catch (error) {
        console.error('⚠ Error al decodificar el token:', error);
        this.logout();
      }
    }
    return null;
  }

  /**
   * 📌 Devuelve los datos del usuario cargados desde el token.
   * 
   * @returns Los datos del usuario o `null` si no hay datos
   */
  getUserData(): any | null {
    return this.loadUserData();
  }

  /**
   * 📌 Inicia sesión con las credenciales proporcionadas y guarda el token en `localStorage`.
   * 
   * @param credentials - Objeto con las credenciales del usuario (`email` y `password`)
   * @returns Observable con la respuesta de la API, que contiene el token de autenticación
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
   * 📌 Actualiza los datos del usuario después de iniciar sesión o cuando se inicia la aplicación.
   * Emite los nuevos datos del usuario y el estado de autenticación.
   */
  private updateUserData(): void {
    const userData = this.loadUserData();
    this.userDataSubject.next(userData);
    this.isLoggedInSubject.next(!!userData);
  }

  /**
   * ✅ Actualiza manualmente la foto de perfil del usuario en el Observable.
   * 
   * @param nuevaFoto - URL de la nueva foto de perfil
   */
  public refrescarDatosUsuario(nuevaFoto: string): void {
    const current = this.loadUserData();
    if (!current) return;

    const actualizado = {
      ...current,
      fotoPerfil: nuevaFoto // Actualiza la foto de perfil
    };

    this.userDataSubject.next(actualizado);
    this.isLoggedInSubject.next(true);
  }

  /**
   * 📌 Cierra la sesión del usuario, eliminando el token y actualizando los estados de autenticación.
   * Redirige al usuario a la página de login.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }
}
