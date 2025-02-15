import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 📌 `BlogComponent`
 *
 * Este componente muestra una lista de artículos del blog relacionados con el cuidado y bienestar de los perros.
 *
 * ℹ️ **Uso:** Se utiliza en la landing page y otras secciones para destacar los últimos posts publicados.
 */
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  /**
   * 📌 Lista de publicaciones del blog.
   *
   * Cada publicación contiene:
   * - `title` (**string**): Título del artículo.
   * - `link` (**string**): Enlace a la publicación completa.
   */
  blogPosts = [
    { title: '5 Consejos para un paseo perfecto', link: '#' },
    { title: 'Alimentación saludable para perros', link: '#' },
    { title: 'Cómo elegir la mejor veterinaria', link: '#' }
  ];
}
