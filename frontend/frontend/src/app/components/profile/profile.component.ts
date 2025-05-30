import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * 📌 Componente `ProfileComponent`
 *
 * Muestra el perfil del usuario autenticado obteniendo la información desde `AuthService`.
 * Si no hay usuario autenticado, redirige a la página de inicio de sesión.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  nombreUsuario?: string;
  fotoPerfil?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de usuario en tiempo real
    this.authService.getUserDataObservable().subscribe(userData => {
      if (userData) {
        this.nombreUsuario = userData.nombre;
        this.fotoPerfil = userData.foto_perfil;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
