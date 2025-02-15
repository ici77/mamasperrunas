import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

/**
 * 📌 Componente `AppComponent`
 *
 * Este es el componente raíz de la aplicación. Se encarga de estructurar la interfaz principal,
 * incluyendo la barra de navegación (`NavbarComponent`), el área de contenido dinámico (`RouterOutlet`)
 * y el pie de página (`FooterComponent`).
 *
 * ℹ️ **Uso:** Este componente se carga al inicio de la aplicación y permanece visible en todas las rutas.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar> <!-- Navbar siempre visible -->
    <router-outlet></router-outlet> <!-- Renderiza la ruta activa -->
    <app-footer></app-footer> <!-- Footer siempre visible -->
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /**
   * 📌 Título de la aplicación.
   * Se utiliza en las pruebas unitarias para verificar su existencia.
   */
  title = 'frontend';
}
