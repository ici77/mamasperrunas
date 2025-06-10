import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 📌 Componente `BannerComponent`
 *
 * Este componente muestra un banner con una imagen de fondo y un título.
 * Se puede reutilizar en diferentes secciones de la aplicación.
 *
 * ℹ️ **Uso:** Se utiliza en la landing page, páginas de categorías y otras secciones.
 */
@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="banner" [style.backgroundImage]="'url(' + backgroundImage + ')'">
      <h1>{{ title }}</h1>
    </div>
  `,
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  /**
   * 📌 Imagen de fondo del banner.
   * Este valor se recibe como `@Input()` desde el componente padre.
   */
  @Input() backgroundImage: string = '';

  /**
   * 📌 Título del banner.
   * Este valor se recibe como `@Input()` desde el componente padre.
   */
  @Input() title: string = '';
}
