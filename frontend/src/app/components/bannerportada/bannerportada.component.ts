import { Component } from '@angular/core';

/**
 * Componente `BannerportadaComponent`
 *
 * Este componente representa una imagen de portada que se muestra en la página principal
 * y puede reutilizarse en otras páginas del sitio web.
 *
 * ℹ️ **Uso:** Se puede incluir en diferentes vistas donde se requiera una imagen destacada.
 */
@Component({
  selector: 'app-bannerportada',
  standalone: true,
  templateUrl: './bannerportada.component.html',
  styleUrls: ['./bannerportada.component.css']
})
export class BannerportadaComponent {
  /**
   * 🔹 Actualmente, este componente solo muestra una imagen estática.
   * 🔹 Se puede extender en el futuro para incluir texto o efectos dinámicos.
   */
}
