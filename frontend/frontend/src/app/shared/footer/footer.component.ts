import { Component } from '@angular/core';

/**
 * 📌 Componente `FooterComponent`
 *
 * Este componente representa el pie de página de la aplicación.
 * Se utiliza para mostrar enlaces de navegación, información de contacto,
 * redes sociales y otros elementos comunes en el footer del sitio web.
 *
 * ℹ️ **Uso:** Se coloca al final de cada página para mantener la coherencia visual
 * y mejorar la navegación.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'], // Corregido: styleUrls en lugar de styleUrl
  standalone: true,
})
export class FooterComponent {
  /**
   * Actualmente, el footer no tiene lógica específica,
   * pero se puede extender para manejar interacciones dinámicas.
   */
}
