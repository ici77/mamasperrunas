import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, NgIf], // ✅ Asegurar que `NgIf` está disponible
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isAuthenticated: boolean = false;
  nombreUsuario?: string;
  fotoPerfil?: string;

  constructor(private elementRef: ElementRef, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // ✅ Suscribirse al estado del usuario en tiempo real
    this.authService.getUserDataObservable().subscribe(userData => {
      this.isAuthenticated = !!userData;
      this.nombreUsuario = userData?.nombre;
      this.fotoPerfil = userData?.foto_perfil;
    });
  }

  /**
   * 📌 Método para cerrar sesión y redirigir al usuario al login.
   */
  logout(): void {
    this.authService.logout();
  }

  ngAfterViewInit() {
    // ✅ Lógica para cerrar menús desplegables
    const cerrarMenu = (menuId: string) => {
      const menu = document.getElementById(menuId);
      if (menu) {
        menu.classList.remove('show');
      }
    };

    const dropdownToggles = this.elementRef.nativeElement.querySelectorAll('.nav-link.dropdown-toggle');

    dropdownToggles.forEach((toggle: HTMLElement) => {
      toggle.addEventListener('click', function () {
        const menuId = this.id.replace('Dropdown', 'Menu');
        setTimeout(() => cerrarMenu(menuId), 1500);
      });
    });

    document.addEventListener('click', (event: MouseEvent) => {
      dropdownToggles.forEach((toggle: HTMLElement) => {
        const menuId = toggle.id.replace('Dropdown', 'Menu');
        const menu = document.getElementById(menuId);
        if (menu && !menu.contains(event.target as Node) && !toggle.contains(event.target as Node)) {
          cerrarMenu(menuId);
        }
      });
    });
  }
}
