import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de ruta que protege las rutas que requieren autenticación.
 * Si el usuario no está autenticado, será redirigido a la página de inicio de sesión.
 * 
 * @example
 * const routes: Routes = [
 *   {
 *     path: 'protected',
 *     component: ProtectedComponent,
 *     canActivate: [AuthGuard] // Protege la ruta
 *   }
 * ];
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * Constructor para inicializar el servicio de autenticación y el enrutador.
   * 
   * @param authService - Servicio que maneja la autenticación del usuario
   * @param router - Enrutador para redirigir al usuario a otras rutas
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método que verifica si el usuario puede acceder a la ruta.
   * Si el usuario no está autenticado, se redirige a la página de login.
   * 
   * @returns `true` si el usuario está autenticado, de lo contrario `false`
   */
  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirige a login si no está autenticado
      return false;
    }
    return true;
  }
}
