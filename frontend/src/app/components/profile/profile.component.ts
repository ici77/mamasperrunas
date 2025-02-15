import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode'; 
import { Router } from '@angular/router';

/**
 * 📌 Componente `ProfileComponent`
 *
 * Este componente muestra el perfil del usuario autenticado. 
 * Obtiene los datos del usuario a partir del token JWT almacenado en `localStorage`.
 * Si el token es inválido o no existe, redirige al usuario a la página de inicio de sesión.
 *
 * ℹ️ **Uso:** Se utiliza en la sección de perfil del usuario (`/profile`).
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  /**
   * 📌 Nombre del usuario obtenido desde el token JWT.
   */
  nombreUsuario: string | undefined;

  /**
   * 📌 URL de la foto de perfil obtenida desde el token JWT.
   */
  fotoPerfil: string | undefined;

  /**
   * Constructor del componente.
   * @param router - Servicio `Router` para redirigir al usuario en caso de token inválido.
   */
  constructor(private router: Router) {}

  /**
   * 📌 Método `ngOnInit()`
   *
   * - Obtiene el token JWT desde `localStorage`.
   * - Decodifica el token y extrae la información del usuario.
   * - Si el token no es válido, redirige a la página de inicio de sesión.
   */
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        this.nombreUsuario = decodedToken.nombre;  // Mapeado al campo 'nombre'
        this.fotoPerfil = decodedToken.foto_perfil;  // Mapeado al campo 'foto_perfil'
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
