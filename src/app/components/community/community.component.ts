import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

/**
 * 📌 Componente `CommunityComponent` de la landing page
 *
 * Este componente muestra una lista de publicaciones dentro de la comunidad, 
 * permitiendo a los usuarios explorar artículos con consejos, experiencias 
 * y recomendaciones sobre la convivencia con mascotas.
 *
 * ℹ️ **Uso:** Se utiliza en la sección de comunidad para mostrar publicaciones 
 * relevantes a los usuarios.
 */
@Component({
  selector: 'app-community',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent {
  /**
   * 📌 Lista de publicaciones dentro de la comunidad.
   * Cada objeto representa un post con su título, descripción breve, autor y foto del autor.
   */
  communityPosts = [
    {
      title: 'Consejos para ser social',
      excerpt: 'Descubre cómo hacer que tu perro se sienta cómodo con otros.',
      author: 'Ana López',
      authorImage: 'assets/images/landing/user3.png'
    },
    {
      title: 'Tu casa más pet-friendly',
      excerpt: 'Te damos algunas ideas para adaptar tu hogar y hacerlo más seguro y divertido.',
      author: 'Carlos Méndez',
      authorImage: 'assets/images/landing/user3.png'
    },
    {
      title: 'Rutas de senderismo con perros',
      excerpt: 'Explora las mejores rutas donde puedes llevar a tu perro.',
      author: 'Laura Sánchez',
      authorImage: 'assets/images/landing/user3.png'
    }
  ];
}
